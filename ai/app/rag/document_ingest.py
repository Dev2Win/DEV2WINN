from __future__ import annotations

import hashlib
import io
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.rag.faiss_store import CourseChunk

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover
    PdfReader = None

try:
    from docx import Document
except ImportError:  # pragma: no cover
    Document = None


SUPPORTED_EXTENSIONS = {".txt", ".md", ".markdown", ".pdf", ".docx"}
DEFAULT_CHUNK_TOKENS = 750
DEFAULT_OVERLAP_TOKENS = 100
MAX_UPLOAD_BYTES = 12 * 1024 * 1024


@dataclass(frozen=True)
class ChunkingOptions:
    chunk_tokens: int = DEFAULT_CHUNK_TOKENS
    overlap_tokens: int = DEFAULT_OVERLAP_TOKENS


def extract_text(filename: str, content: bytes) -> tuple[str, dict[str, Any]]:
    if len(content) > MAX_UPLOAD_BYTES:
        raise ValueError("File is too large. Max upload size is 12MB.")

    suffix = Path(filename).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise ValueError("Unsupported file type. Upload TXT, MD, PDF, or DOCX.")

    if suffix in {".txt", ".md", ".markdown"}:
        text = _decode_text(content)
        return text, {"file_type": suffix.lstrip("."), "page_count": None}
    if suffix == ".pdf":
        return _extract_pdf(content)
    if suffix == ".docx":
        return _extract_docx(content)
    raise ValueError("Unsupported file type. Upload TXT, MD, PDF, or DOCX.")


def chunk_document(
    *,
    text: str,
    filename: str,
    user_id: str,
    conversation_id: str,
    title: str | None = None,
    options: ChunkingOptions | None = None,
    document_id: str | None = None,
    base_metadata: dict[str, Any] | None = None,
) -> list[CourseChunk]:
    opts = options or ChunkingOptions()
    if opts.chunk_tokens < 200 or opts.chunk_tokens > 1500:
        raise ValueError("chunk_tokens must be between 200 and 1500.")
    if opts.overlap_tokens < 0 or opts.overlap_tokens >= opts.chunk_tokens:
        raise ValueError("overlap_tokens must be non-negative and less than chunk_tokens.")

    normalized = _normalize_text(text)
    if not normalized:
        raise ValueError("No extractable text found in uploaded document.")

    doc_id = document_id or _document_id(filename, normalized)
    sections = _split_sections(normalized)
    token_chunks = _pack_sections(sections, opts.chunk_tokens, opts.overlap_tokens)
    display_title = title or Path(filename).stem or filename

    chunks: list[CourseChunk] = []
    for index, tokens in enumerate(token_chunks):
        chunk_text = " ".join(tokens).strip()
        if not chunk_text:
            continue
        chunks.append(
            CourseChunk(
                id=f"{doc_id}:chunk:{index + 1}",
                title=display_title,
                source=f"upload/{doc_id}/{filename}",
                text=chunk_text,
                user_id=user_id,
                conversation_id=conversation_id,
                metadata={
                    "document_id": doc_id,
                    "filename": filename,
                    "chunk_index": index,
                    "chunk_tokens": len(tokens),
                    "chunk_target_tokens": opts.chunk_tokens,
                    "overlap_tokens": opts.overlap_tokens,
                    **(base_metadata or {}),
                },
            )
        )
    return chunks


def _extract_pdf(content: bytes) -> tuple[str, dict[str, Any]]:
    if PdfReader is None:
        raise ValueError("PDF extraction dependency is not installed.")
    reader = PdfReader(io.BytesIO(content))
    pages = []
    for page_index, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        if page_text.strip():
            pages.append(f"\n\n[Page {page_index + 1}]\n{page_text}")
    return "\n".join(pages), {"file_type": "pdf", "page_count": len(reader.pages)}


def _extract_docx(content: bytes) -> tuple[str, dict[str, Any]]:
    if Document is None:
        raise ValueError("DOCX extraction dependency is not installed.")
    document = Document(io.BytesIO(content))
    paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
    return "\n\n".join(paragraphs), {"file_type": "docx", "page_count": None}


def _decode_text(content: bytes) -> str:
    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            return content.decode(encoding)
        except UnicodeDecodeError:
            continue
    return content.decode("utf-8", errors="ignore")


def _normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _split_sections(text: str) -> list[str]:
    blocks = [block.strip() for block in re.split(r"\n\s*\n", text) if block.strip()]
    sections: list[str] = []
    current: list[str] = []
    for block in blocks:
        if _looks_like_heading(block) and current:
            sections.append("\n\n".join(current))
            current = [block]
        else:
            current.append(block)
    if current:
        sections.append("\n\n".join(current))
    return sections or [text]


def _looks_like_heading(block: str) -> bool:
    if block.startswith("#"):
        return True
    words = block.split()
    return len(words) <= 12 and len(block) <= 100 and not block.endswith((".", ",", ";"))


def _pack_sections(sections: list[str], chunk_tokens: int, overlap_tokens: int) -> list[list[str]]:
    all_tokens = [token for section in sections for token in _tokens(section)]
    if not all_tokens:
        return []
    step = max(chunk_tokens - overlap_tokens, 1)
    chunks: list[list[str]] = []
    cursor = 0
    while cursor < len(all_tokens):
        chunk = all_tokens[cursor : cursor + chunk_tokens]
        if chunk:
            chunks.append(chunk)
        if cursor + chunk_tokens >= len(all_tokens):
            break
        cursor += step
    return chunks


def _split_long_tokens(tokens: list[str], max_tokens: int) -> list[list[str]]:
    if len(tokens) <= max_tokens:
        return [tokens]
    parts: list[list[str]] = []
    cursor = 0
    while cursor < len(tokens):
        parts.append(tokens[cursor : cursor + max_tokens])
        cursor += max_tokens
    return parts


def _tokens(text: str) -> list[str]:
    return re.findall(r"\S+", text)


def _tail(tokens: list[str], count: int) -> list[str]:
    if count <= 0:
        return []
    return tokens[-count:]


def _document_id(filename: str, text: str) -> str:
    digest = hashlib.sha256(f"{filename}\n{text[:10000]}".encode("utf-8")).hexdigest()[:16]
    stem = re.sub(r"[^a-zA-Z0-9_-]+", "-", Path(filename).stem).strip("-").lower() or "document"
    return f"{stem}-{digest}"

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from threading import Lock
from typing import Any

import numpy as np

from app.core.config import settings

try:
    import faiss
except ImportError:  # pragma: no cover - exercised only in incomplete local envs
    faiss = None

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover
    genai = None


@dataclass
class CourseChunk:
    id: str
    text: str
    source: str
    title: str = ""
    metadata: dict[str, Any] | None = None
    user_id: str = "global"
    conversation_id: str = "global"


class LocalFaissRagStore:
    def __init__(self) -> None:
        self.index_path = Path(settings.rag_index_path)
        self.store_path = Path(settings.rag_store_path)
        self._lock = Lock()
        self._chunks: list[CourseChunk] = []
        self._index: Any = None
        self._loaded = False
        if genai and settings.google_api_key:
            genai.configure(api_key=settings.google_api_key)

    def add_chunks(self, chunks: list[CourseChunk]) -> int:
        if not chunks:
            return 0
        with self._lock:
            self._load()
            self._chunks.extend(chunks)
            self._persist()
        return len(chunks)

    def search(
        self,
        query: str,
        top_k: int = 4,
        user_id: str = "anonymous",
        conversation_id: str = "default",
    ) -> list[dict[str, Any]]:
        with self._lock:
            self._load()
            scoped_chunks = self._scoped_chunks(user_id, conversation_id)
            if not scoped_chunks:
                return []
            if not settings.google_api_key:
                return self._fallback_search(query, top_k, scoped_chunks)
        query_vector = self._embed([query])
        chunk_vectors = self._embed([chunk.text for chunk in scoped_chunks])
        temp_index = self._new_index(chunk_vectors.shape[1])
        if temp_index is None:
            return self._fallback_search(query, top_k, scoped_chunks)
        temp_index.add(chunk_vectors)
        with self._lock:
            scores, indexes = temp_index.search(query_vector, min(top_k, len(scoped_chunks)))
            results: list[dict[str, Any]] = []
            for score, idx in zip(scores[0], indexes[0]):
                if idx < 0:
                    continue
                if float(score) <= 0:
                    continue
                chunk = scoped_chunks[int(idx)]
                results.append(
                    {
                        "id": chunk.id,
                        "title": chunk.title,
                        "source": chunk.source,
                        "text": chunk.text[:1200],
                        "score": float(score),
                        "metadata": chunk.metadata or {},
                        "user_id": chunk.user_id,
                        "conversation_id": chunk.conversation_id,
                    }
                )
            return results

    def _new_index(self, dimensions: int) -> Any:
        if faiss is None:
            return None
        return faiss.IndexFlatIP(dimensions)

    def _embed(self, texts: list[str]) -> np.ndarray:
        if genai and settings.google_api_key:
            vectors = []
            try:
                for text in texts:
                    resp = genai.embed_content(
                        model=settings.embedding_model,
                        content=text,
                        task_type="retrieval_document",
                    )
                    vectors.append(resp["embedding"])
                arr = np.asarray(vectors, dtype="float32")
            except Exception:
                arr = self._hash_embed(texts)
        else:
            arr = self._hash_embed(texts)
        norms = np.linalg.norm(arr, axis=1, keepdims=True)
        norms[norms == 0] = 1
        return arr / norms

    def _hash_embed(self, texts: list[str], dimensions: int = 384) -> np.ndarray:
        vectors = np.zeros((len(texts), dimensions), dtype="float32")
        for row, text in enumerate(texts):
            for token in text.lower().split():
                idx = hash(token) % dimensions
                vectors[row, idx] += 1.0
        return vectors

    def _fallback_search(
        self,
        query: str,
        top_k: int,
        chunks: list[CourseChunk] | None = None,
    ) -> list[dict[str, Any]]:
        query_terms = self._terms(query)
        scored = []
        for chunk in chunks if chunks is not None else self._chunks:
            terms = self._terms(chunk.text)
            score = len(query_terms & terms) / max(len(query_terms), 1)
            scored.append((score, chunk))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [
            {
                "id": chunk.id,
                "title": chunk.title,
                "source": chunk.source,
                "text": chunk.text[:1200],
                "score": float(score),
                "metadata": chunk.metadata or {},
                "user_id": chunk.user_id,
                "conversation_id": chunk.conversation_id,
            }
            for score, chunk in scored[:top_k]
            if score > 0
        ]

    def _scoped_chunks(self, user_id: str, conversation_id: str) -> list[CourseChunk]:
        return [
            chunk
            for chunk in self._chunks
            if (chunk.user_id == "global" and chunk.conversation_id == "global")
            or (chunk.user_id == user_id and chunk.conversation_id == conversation_id)
        ]

    def _terms(self, text: str) -> set[str]:
        stopwords = {
            "a",
            "an",
            "and",
            "about",
            "course",
            "for",
            "i",
            "in",
            "is",
            "me",
            "of",
            "on",
            "remember",
            "should",
            "the",
            "to",
            "what",
            "with",
        }
        normalized = "".join(ch.lower() if ch.isalnum() else " " for ch in text)
        return {term for term in normalized.split() if len(term) > 2 and term not in stopwords}

    def _load(self) -> None:
        if self._loaded:
            return
        if self.store_path.exists():
            data = json.loads(self.store_path.read_text())
            self._chunks = [CourseChunk(**item) for item in data.get("chunks", [])]
        if faiss and self.index_path.exists():
            self._index = faiss.read_index(str(self.index_path))
        self._loaded = True

    def _persist(self) -> None:
        self.store_path.parent.mkdir(parents=True, exist_ok=True)
        self.index_path.parent.mkdir(parents=True, exist_ok=True)
        self.store_path.write_text(
            json.dumps({"chunks": [asdict(chunk) for chunk in self._chunks]}, indent=2)
        )


rag_store = LocalFaissRagStore()

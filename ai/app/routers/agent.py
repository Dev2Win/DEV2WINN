from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.agent.loop import run_agent_turn
from app.agent import tools
from app.agent.memory import memory_store
from app.agent.mcp import public_mcp_server_info
from app.learning import adaptive_engine
from app.rag import CourseChunk, rag_store
from app.rag.document_ingest import ChunkingOptions, chunk_document, extract_text

router = APIRouter(prefix="/v1", tags=["agent"])


class ChatMessage(BaseModel):
    role: str
    content: str | list[dict[str, Any]]


class AgentChatRequest(BaseModel):
    user_id: str = Field(default="anonymous")
    conversation_id: str = Field(default="default")
    message: str = Field(min_length=1, max_length=8_000)
    history: list[ChatMessage] = Field(default_factory=list)
    stream: bool = False


class AgentChatResponse(BaseModel):
    status: str
    message: str
    model: str | None = None
    tool_events: list[dict[str, Any]] = Field(default_factory=list)
    usage: dict[str, Any] = Field(default_factory=dict)
    learner: dict[str, Any] = Field(default_factory=dict)


class ToolInfo(BaseModel):
    name: str
    description: str
    mutates: bool
    budget_cost: int
    requires_confirmation: bool


class ToolRegistryResponse(BaseModel):
    local_tools: list[ToolInfo]
    mcp_servers: list[dict[str, str]]


class RagIngestRequest(BaseModel):
    chunks: list[dict[str, Any]]
    user_id: str = "global"
    conversation_id: str = "global"


class RenameSessionRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class RagDocumentResponse(BaseModel):
    status: str
    document_id: str
    filename: str
    inserted: int
    chunk_tokens: int
    overlap_tokens: int
    metadata: dict[str, Any] = Field(default_factory=dict)


@router.get("/agent/tools", response_model=ToolRegistryResponse)
async def list_tools() -> ToolRegistryResponse:
    local_tools = [
        ToolInfo(
            name=tool.name,
            description=tool.description,
            mutates=tool.mutates,
            budget_cost=tool.budget_cost,
            requires_confirmation=tool.requires_confirmation,
        )
        for tool in tools.all_tools()
    ]
    return ToolRegistryResponse(local_tools=local_tools, mcp_servers=public_mcp_server_info())


@router.post("/agent/chat", response_model=AgentChatResponse)
async def agent_chat(
    req: AgentChatRequest,
    authorization: str | None = Header(default=None),
):
    auth_token = authorization.removeprefix("Bearer ").strip() if authorization else None
    history = [message.model_dump() for message in req.history]
    result = await run_agent_turn(
        user_id=req.user_id,
        conversation_id=req.conversation_id,
        message=req.message,
        history=history,
        auth_token=auth_token,
    )
    if not req.stream:
        return AgentChatResponse(**result)

    async def events():
        yield "event: message\n"
        yield "data: " + json.dumps(result) + "\n\n"
        yield "event: done\n"
        yield "data: {}\n\n"

    return StreamingResponse(events(), media_type="text/event-stream")


@router.post("/rag/chunks")
async def ingest_chunks(req: RagIngestRequest) -> dict[str, int]:
    chunks = [
        CourseChunk(
            **{
                "user_id": req.user_id,
                "conversation_id": req.conversation_id,
                **chunk,
            }
        )
        for chunk in req.chunks
    ]
    return {"inserted": rag_store.add_chunks(chunks)}


@router.post("/rag/documents", response_model=RagDocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(default="anonymous"),
    conversation_id: str = Form(default="default"),
    title: str | None = Form(default=None),
    chunk_tokens: int = Form(default=750),
    overlap_tokens: int = Form(default=100),
) -> RagDocumentResponse:
    content = await file.read()
    try:
        text, metadata = extract_text(file.filename or "document", content)
        chunks = chunk_document(
            text=text,
            filename=file.filename or "document",
            user_id=user_id,
            conversation_id=conversation_id,
            title=title,
            options=ChunkingOptions(chunk_tokens=chunk_tokens, overlap_tokens=overlap_tokens),
            base_metadata=metadata,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    inserted = rag_store.add_chunks(chunks)
    document_id = chunks[0].metadata["document_id"] if chunks and chunks[0].metadata else "document"
    return RagDocumentResponse(
        status="ok",
        document_id=document_id,
        filename=file.filename or "document",
        inserted=inserted,
        chunk_tokens=chunk_tokens,
        overlap_tokens=overlap_tokens,
        metadata=metadata,
    )


@router.get("/agent/learners/{user_id}")
async def learner_profile(user_id: str) -> dict[str, Any]:
    return adaptive_engine.profile(user_id)


@router.get("/agent/users/{user_id}/sessions")
async def list_sessions(user_id: str) -> dict[str, Any]:
    return {"sessions": memory_store.list_sessions(user_id)}


@router.patch("/agent/users/{user_id}/sessions/{conversation_id}")
async def rename_session(user_id: str, conversation_id: str, req: RenameSessionRequest) -> dict[str, Any]:
    return {"session": memory_store.rename_session(user_id, conversation_id, req.name)}


@router.delete("/agent/users/{user_id}/sessions/{conversation_id}")
async def delete_session(user_id: str, conversation_id: str) -> dict[str, Any]:
    return memory_store.soft_delete_session(user_id, conversation_id)

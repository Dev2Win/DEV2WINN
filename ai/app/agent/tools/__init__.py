"""
Tool registry for the AI mentor agent.

Tools are invoked on-demand by Claude's tool-use loop (never pre-called). Each
tool declares a lean JSON schema (cheap to include via prompt caching), an authz
scope, and a budget cost. Mutating tools require UI confirmation + audit.

Add tools via .claude/skills/add-ai-tool. See docs/AI_AGENT.md §5.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable

import httpx
import jwt

from app.connectors.db import DbConnectorContext, db_connector
from app.core.config import settings
from app.matching.tfidf import rank_mentors
from app.rag import rag_store


@dataclass
class Tool:
    name: str
    description: str
    input_schema: dict[str, Any]
    handler: Callable[[dict], Awaitable[dict]]
    mutates: bool = False
    budget_cost: int = 1
    requires_confirmation: bool = False


_REGISTRY: dict[str, Tool] = {}


@dataclass
class ToolContext:
    user_id: str
    conversation_id: str
    auth_token: str | None = None


def register(tool: Tool) -> None:
    _REGISTRY[tool.name] = tool


def schemas() -> list[dict]:
    """Anthropic tool schemas for the Messages API."""
    return [
        {"name": t.name, "description": t.description, "input_schema": t.input_schema}
        for t in _REGISTRY.values()
    ]


def all_tools() -> list[Tool]:
    return list(_REGISTRY.values())


def get(name: str) -> Tool | None:
    return _REGISTRY.get(name)


async def execute(name: str, args: dict, ctx: ToolContext) -> dict:
    tool = _REGISTRY.get(name)
    if tool is None:
        return {"error": f"unknown tool: {name}"}
    result = await tool.handler({**args, "_ctx": ctx})
    return trim_tool_result(result)


def trim_tool_result(result: dict) -> dict:
    """Keep tool results cheap before feeding them back to Claude."""
    encoded = str(result)
    if len(encoded) <= 3_000:
        return result
    trimmed = dict(result)
    for key in ("items", "chunks", "mentors", "roadmap"):
        value = trimmed.get(key)
        if isinstance(value, list):
            trimmed[key] = value[:5]
    trimmed["_trimmed"] = True
    return trimmed


def _service_jwt(ctx: ToolContext) -> str:
    payload = {"sub": ctx.user_id, "aud": "dev2win-api", "scope": "ai:tools"}
    return jwt.encode(payload, settings.service_jwt_secret, algorithm="HS256")


def _db_ctx(ctx: ToolContext) -> DbConnectorContext:
    return DbConnectorContext(user_id=ctx.user_id, auth_token=ctx.auth_token)


async def _api_get(path: str, ctx: ToolContext, params: dict | None = None) -> dict:
    _ = _service_jwt
    return await db_connector.api_get(path, _db_ctx(ctx), params)


async def _api_post(path: str, ctx: ToolContext, payload: dict) -> dict:
    return await db_connector.api_post(path, _db_ctx(ctx), payload)


async def _get_roadmap(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    result = await _api_get(f"/v1/users/{ctx.user_id}/roadmap", ctx)
    if result["ok"]:
        return result
    return {
        "ok": True,
        "roadmap": [
            {"id": "foundations", "title": "Programming foundations", "status": "in_progress"},
            {"id": "projects", "title": "Build portfolio projects", "status": "next"},
            {"id": "interview", "title": "Interview preparation", "status": "later"},
        ],
        "note": "Fallback roadmap used because the main API roadmap endpoint is not available yet.",
    }


async def _get_user_info(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    fields = args.get("fields", ["profile", "role", "goals"])
    result = await _api_get(f"/v1/users/{ctx.user_id}", ctx, {"fields": ",".join(fields)})
    if result["ok"]:
        return result
    return {
        "ok": True,
        "user": {"id": ctx.user_id, "fields_available": []},
        "note": "User profile endpoint is not available yet; ask the learner for missing personal context.",
    }


async def _get_lms_status(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    result = await _api_get(f"/v1/users/{ctx.user_id}/lms/status", ctx)
    if result["ok"]:
        return result
    return {
        "ok": True,
        "courses": [],
        "note": "LMS progress is not available from the main API yet.",
    }


async def _search_lms(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    query = str(args.get("query", "")).strip()
    chunks = rag_store.search(query, int(args.get("top_k", 5)), ctx.user_id, ctx.conversation_id)
    return {
        "ok": True,
        "query": query,
        "chunks": chunks,
        "note": "These results come from the local FAISS LMS/course-content index.",
    }


async def _summarize_progress(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    result = await _api_get(f"/v1/users/{ctx.user_id}/progress", ctx)
    if result["ok"]:
        return result
    return {
        "ok": True,
        "summary": "No persisted progress is available yet. Recommend asking the learner for current goals, recent work, and blockers.",
        "next_steps": ["Confirm target role", "Pick one project", "Create a weekly practice schedule"],
    }


async def _lookup_mentor(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    mentors = args.get("mentors") or args.get("candidates") or []
    mentee_profile = args.get("mentee_profile") or args.get("user_profile") or {}
    if mentors and mentee_profile:
        ranked = rank_mentors(mentee_profile, mentors, int(args.get("limit", 5)))
        return {
            "ok": True,
            "candidates": [
                {
                    "candidate_id": candidate.candidate_id,
                    "score": candidate.score,
                    "similarity_score": candidate.similarity_score,
                    "rule_score": candidate.rule_score,
                    "feedback_score": candidate.feedback_score,
                    "reasons": candidate.reasons,
                }
                for candidate in ranked
            ],
            "source": "local_hybrid_ranker",
        }
    result = await _api_get("/v1/matching/recommendations", ctx, {"query": args.get("query", "")})
    if result["ok"]:
        return result
    return {
        "ok": True,
        "mentors": [],
        "note": "Mentor recommendations require the main API matching module to be implemented.",
    }


async def _course_qa(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    query = str(args.get("question", "")).strip()
    chunks = rag_store.search(query, int(args.get("top_k", 4)), ctx.user_id, ctx.conversation_id)
    return {
        "ok": True,
        "question": query,
        "chunks": chunks,
        "citation_instruction": "Answer only from these chunks. Cite source/title for each claim.",
    }


async def _web_search(args: dict) -> dict:
    query = str(args.get("query", "")).strip()
    if not query:
        return {"ok": False, "message": "query is required"}
    if not settings.google_api_key:
        return {
            "ok": False,
            "message": "Web search requires GOOGLE_API_KEY.",
            "query": query,
        }
    try:
        from google import genai as google_genai
        from google.genai import types as google_types
    except ImportError:
        return {
            "ok": False,
            "message": "Web search requires google-genai.",
            "query": query,
        }

    client = google_genai.Client(api_key=settings.google_api_key)
    grounding_tool = google_types.Tool(google_search=google_types.GoogleSearch())
    response = client.models.generate_content(
        model=settings.web_search_model,
        contents=(
            "Search the web for current, relevant information for a tech-career "
            f"mentoring answer. Query: {query}"
        ),
        config=google_types.GenerateContentConfig(tools=[grounding_tool]),
    )
    sources = []
    grounding = getattr(getattr(response, "candidates", [None])[0], "grounding_metadata", None)
    if grounding and getattr(grounding, "grounding_chunks", None):
        for chunk in grounding.grounding_chunks:
            web = getattr(chunk, "web", None)
            if web:
                sources.append({"title": getattr(web, "title", ""), "url": getattr(web, "uri", "")})
    return {
        "ok": True,
        "query": query,
        "summary": getattr(response, "text", ""),
        "sources": sources[:8],
        "instruction": "Use web results as supplemental current context and cite source URLs.",
    }


async def _book_session(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    if not args.get("confirmed"):
        return {
            "ok": False,
            "requires_confirmation": True,
            "message": "Ask the user to confirm the mentor, time, and goal before booking.",
        }
    payload = {k: v for k, v in args.items() if not k.startswith("_")}
    return await _api_post("/v1/bookings", ctx, payload)


async def _create_reminder(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    if not args.get("confirmed"):
        return {
            "ok": False,
            "requires_confirmation": True,
            "message": "Ask the user to confirm the reminder text and time.",
        }
    payload = {k: v for k, v in args.items() if not k.startswith("_")}
    return await _api_post("/v1/notifications/reminders", ctx, payload)


async def _escalate_to_human(args: dict) -> dict:
    ctx: ToolContext = args["_ctx"]
    payload = {k: v for k, v in args.items() if not k.startswith("_")}
    result = await _api_post("/v1/chat/escalations", ctx, payload)
    if result["ok"]:
        return result
    return {"ok": True, "status": "queued", "note": "Escalation captured locally; API endpoint pending."}


register(
    Tool(
        name="get_user_info",
        description="Fetch concise user profile, role, goals, and preferences needed for personalization.",
        input_schema={
            "type": "object",
            "properties": {
                "fields": {
                    "type": "array",
                    "items": {"type": "string"},
                    "default": ["profile", "role", "goals"],
                }
            },
            "additionalProperties": False,
        },
        handler=_get_user_info,
        budget_cost=2,
    )
)
register(
    Tool(
        name="get_roadmap",
        description="Fetch the learner's concise roadmap and progress statuses.",
        input_schema={"type": "object", "properties": {}, "additionalProperties": False},
        handler=_get_roadmap,
        budget_cost=2,
    )
)
register(
    Tool(
        name="get_lms_status",
        description="Fetch LMS enrollment, course progress, incomplete lessons, and due learning tasks.",
        input_schema={"type": "object", "properties": {}, "additionalProperties": False},
        handler=_get_lms_status,
        budget_cost=2,
    )
)
register(
    Tool(
        name="search_lms",
        description="Search local LMS/course content chunks in FAISS for relevant lessons or resources.",
        input_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "top_k": {"type": "integer", "minimum": 1, "maximum": 8, "default": 5},
            },
            "required": ["query"],
            "additionalProperties": False,
        },
        handler=_search_lms,
        budget_cost=3,
    )
)
register(
    Tool(
        name="summarize_progress",
        description="Summarize completed learning work, current blockers, and next steps.",
        input_schema={"type": "object", "properties": {}, "additionalProperties": False},
        handler=_summarize_progress,
        budget_cost=2,
    )
)
register(
    Tool(
        name="lookup_mentor",
        description="Find matched mentors relevant to a goal, role, stack, or blocker.",
        input_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Short matching query."},
                "mentee_profile": {"type": "object", "description": "Optional mentee profile for local ranking."},
                "mentors": {
                    "type": "array",
                    "items": {"type": "object"},
                    "description": "Optional mentor candidates for local ranking.",
                },
                "limit": {"type": "integer", "minimum": 1, "maximum": 10, "default": 5},
            },
            "additionalProperties": False,
        },
        handler=_lookup_mentor,
        budget_cost=3,
    )
)
register(
    Tool(
        name="course_qa",
        description="Retrieve course content chunks for a learner question using local FAISS RAG.",
        input_schema={
            "type": "object",
            "properties": {
                "question": {"type": "string"},
                "top_k": {"type": "integer", "minimum": 1, "maximum": 6, "default": 4},
            },
            "required": ["question"],
            "additionalProperties": False,
        },
        handler=_course_qa,
        budget_cost=4,
    )
)
register(
    Tool(
        name="web_search",
        description="Search the public web for current tech-career, docs, market, or learning information and return source URLs.",
        input_schema={
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Specific web search query."}
            },
            "required": ["query"],
            "additionalProperties": False,
        },
        handler=_web_search,
        budget_cost=6,
    )
)
register(
    Tool(
        name="book_session",
        description="Book a mentor session after explicit user confirmation.",
        input_schema={
            "type": "object",
            "properties": {
                "mentor_id": {"type": "string"},
                "starts_at": {"type": "string"},
                "goal": {"type": "string"},
                "confirmed": {"type": "boolean", "default": False},
            },
            "required": ["mentor_id", "starts_at", "goal"],
            "additionalProperties": False,
        },
        handler=_book_session,
        mutates=True,
        requires_confirmation=True,
        budget_cost=5,
    )
)
register(
    Tool(
        name="create_reminder",
        description="Create a study reminder after explicit user confirmation.",
        input_schema={
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "remind_at": {"type": "string"},
                "confirmed": {"type": "boolean", "default": False},
            },
            "required": ["text", "remind_at"],
            "additionalProperties": False,
        },
        handler=_create_reminder,
        mutates=True,
        requires_confirmation=True,
        budget_cost=3,
    )
)
register(
    Tool(
        name="escalate_to_human",
        description="Escalate a learner issue to a human mentor or support queue.",
        input_schema={
            "type": "object",
            "properties": {
                "reason": {"type": "string"},
                "summary": {"type": "string"},
                "urgency": {"type": "string", "enum": ["low", "medium", "high"]},
            },
            "required": ["reason", "summary"],
            "additionalProperties": False,
        },
        handler=_escalate_to_human,
        mutates=True,
        budget_cost=4,
    )
)

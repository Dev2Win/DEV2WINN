"""
Custom Claude tool loop for the 24/7 mentor agent (skeleton).

Full design — prompt caching, context compaction, model routing, per-user token
budgets, SSE streaming — is in docs/AI_AGENT.md. This is the Phase 8 entry point;
it is intentionally a stub until P1/P2 land the data it needs.
"""
from __future__ import annotations

from app.core.config import settings
from app.agent import tools

SYSTEM_PROMPT = (
    "You are Dev2Win's AI mentor for software-career learners. Be concise, "
    "practical, and encouraging. Use tools only when needed. Cite course sources "
    "when answering from content. Escalate to a human mentor for anything outside "
    "career/learning guidance. You are an AI, not a human mentor."
)


def route_model(difficulty: str) -> str:
    """Token efficiency: cheap model for simple turns, smarter for hard ones."""
    return {
        "low": settings.model_fast,
        "medium": settings.model_smart,
        "high": settings.model_deep,
    }.get(difficulty, settings.model_smart)


async def run_turn(user_id: str, conversation: list[dict]) -> dict:
    """Placeholder turn handler.

    Phase 8 will: build cached context, call Claude with tools, run the
    tool_use -> tool_result loop, enforce the Redis token budget, and stream.
    """
    _ = (settings.anthropic_api_key, tools.schemas())  # wired up in Phase 8
    return {
        "status": "not_implemented",
        "message": "AI mentor agent lands in Phase 8 (see docs/AI_AGENT.md).",
        "user_id": user_id,
    }

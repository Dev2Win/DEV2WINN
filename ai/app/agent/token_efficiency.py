from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from app.core.config import settings


LOW_COMPLEXITY_TERMS = ("hi", "hello", "thanks", "thank you", "what is", "define")
HIGH_COMPLEXITY_TERMS = (
    "plan",
    "roadmap",
    "debug",
    "architecture",
    "compare",
    "strategy",
    "tradeoff",
    "interview",
)


@dataclass
class BudgetSnapshot:
    allowed: bool
    reason: str | None = None
    daily_used: int = 0
    session_used: int = 0
    daily_limit: int = settings.agent_daily_token_budget
    session_limit: int = settings.agent_session_token_budget


@dataclass
class InMemoryBudgetStore:
    """Process-local budget store.

    Redis is the production target, but this keeps local development and tests
    deterministic until Redis-backed sessions land in the server.
    """

    usage: dict[str, int] = field(default_factory=dict)

    def _daily_key(self, user_id: str) -> str:
        day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        return f"daily:{day}:{user_id}"

    def _session_key(self, conversation_id: str) -> str:
        return f"session:{conversation_id}"

    def check(self, user_id: str, conversation_id: str, estimated_tokens: int) -> BudgetSnapshot:
        daily_key = self._daily_key(user_id)
        session_key = self._session_key(conversation_id)
        daily_used = self.usage.get(daily_key, 0)
        session_used = self.usage.get(session_key, 0)
        if daily_used + estimated_tokens > settings.agent_daily_token_budget:
            return BudgetSnapshot(False, "daily token budget exceeded", daily_used, session_used)
        if session_used + estimated_tokens > settings.agent_session_token_budget:
            return BudgetSnapshot(False, "session token budget exceeded", daily_used, session_used)
        return BudgetSnapshot(True, None, daily_used, session_used)

    def record(self, user_id: str, conversation_id: str, tokens: int) -> None:
        daily_key = self._daily_key(user_id)
        session_key = self._session_key(conversation_id)
        self.usage[daily_key] = self.usage.get(daily_key, 0) + max(tokens, 0)
        self.usage[session_key] = self.usage.get(session_key, 0) + max(tokens, 0)


budget_store = InMemoryBudgetStore()


def estimate_tokens(value: Any) -> int:
    text = value if isinstance(value, str) else json.dumps(value, separators=(",", ":"))
    return max(1, len(text) // 4)


def route_difficulty(message: str) -> str:
    normalized = message.lower().strip()
    if len(normalized) < 80 and any(term in normalized for term in LOW_COMPLEXITY_TERMS):
        return "low"
    if len(normalized) > 500 or any(term in normalized for term in HIGH_COMPLEXITY_TERMS):
        return "medium"
    return "medium"


def cache_key(*parts: str) -> str:
    payload = "\n".join(parts).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def compact_messages(messages: list[dict[str, Any]], keep_last: int = 8) -> list[dict[str, Any]]:
    """Keep recent turns verbatim and summarize older user/assistant text."""
    if len(messages) <= keep_last:
        return messages

    old = messages[:-keep_last]
    kept = messages[-keep_last:]
    snippets: list[str] = []
    for msg in old:
        role = msg.get("role", "unknown")
        content = msg.get("content", "")
        if isinstance(content, str):
            snippets.append(f"{role}: {content[:240]}")
        elif isinstance(content, list):
            text_parts = [str(part.get("text", "")) for part in content if isinstance(part, dict)]
            snippets.append(f"{role}: {' '.join(text_parts)[:240]}")
    summary = "Earlier conversation summary: " + " | ".join(snippets[-12:])
    return [{"role": "user", "content": summary}, *kept]

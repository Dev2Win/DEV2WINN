from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Any

from app.core.config import settings


def _safe_id(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_.-]+", "-", value.strip())
    return cleaned[:120] or "default"


@dataclass
class StoredTurn:
    role: str
    content: str
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    tool_events: list[dict[str, Any]] = field(default_factory=list)


class ConversationMemoryStore:
    def __init__(self) -> None:
        self.root = Path(settings.agent_memory_path)
        self._lock = Lock()

    def session_path(self, user_id: str, conversation_id: str) -> Path:
        return self.root / _safe_id(user_id) / "sessions" / f"{_safe_id(conversation_id)}.json"

    def load(self, user_id: str, conversation_id: str, limit: int = 16) -> list[dict[str, Any]]:
        path = self.session_path(user_id, conversation_id)
        if not path.exists():
            return []
        with self._lock:
            data = json.loads(path.read_text())
        if data.get("deleted_at"):
            return []
        turns = data.get("turns", [])[-limit:]
        return [{"role": turn["role"], "content": turn["content"]} for turn in turns]

    def list_sessions(self, user_id: str, include_deleted: bool = False) -> list[dict[str, Any]]:
        session_dir = self.root / _safe_id(user_id) / "sessions"
        if not session_dir.exists():
            return []
        sessions = []
        for path in session_dir.glob("*.json"):
            data = json.loads(path.read_text())
            if data.get("deleted_at") and not include_deleted:
                continue
            turns = data.get("turns", [])
            sessions.append(
                {
                    "conversation_id": data.get("conversation_id", path.stem),
                    "name": data.get("name") or data.get("conversation_id", path.stem),
                    "deleted_at": data.get("deleted_at"),
                    "updated_at": turns[-1]["created_at"] if turns else data.get("updated_at"),
                    "turn_count": len(turns),
                }
            )
        sessions.sort(key=lambda item: item.get("updated_at") or "", reverse=True)
        return sessions

    def get_session(self, user_id: str, conversation_id: str, limit: int = 80) -> dict[str, Any]:
        path = self.session_path(user_id, conversation_id)
        if not path.exists():
            return self._session_detail(self._load_raw(path, user_id, conversation_id), limit=limit)
        with self._lock:
            data = json.loads(path.read_text())
        return self._session_detail(data, limit=limit)

    def rename_session(self, user_id: str, conversation_id: str, name: str) -> dict[str, Any]:
        path = self.session_path(user_id, conversation_id)
        with self._lock:
            path.parent.mkdir(parents=True, exist_ok=True)
            data = self._load_raw(path, user_id, conversation_id)
            data["name"] = name.strip()[:120] or conversation_id
            data["updated_at"] = datetime.now(timezone.utc).isoformat()
            path.write_text(json.dumps(data, indent=2))
        return self._session_summary(data)

    def soft_delete_session(self, user_id: str, conversation_id: str) -> dict[str, Any]:
        path = self.session_path(user_id, conversation_id)
        with self._lock:
            data = self._load_raw(path, user_id, conversation_id)
            data["deleted_at"] = datetime.now(timezone.utc).isoformat()
            data["updated_at"] = data["deleted_at"]
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(data, indent=2))
        return {"conversation_id": conversation_id, "deleted": True}

    def append_turns(
        self,
        user_id: str,
        conversation_id: str,
        user_message: str,
        assistant_message: str,
        tool_events: list[dict[str, Any]] | None = None,
    ) -> None:
        path = self.session_path(user_id, conversation_id)
        with self._lock:
            path.parent.mkdir(parents=True, exist_ok=True)
            data = self._load_raw(path, user_id, conversation_id)
            data["turns"].append(asdict(StoredTurn(role="user", content=user_message)))
            data["turns"].append(
                asdict(
                    StoredTurn(
                        role="assistant",
                        content=assistant_message,
                        tool_events=tool_events or [],
                    )
                )
            )
            data["turns"] = data["turns"][-80:]
            data.setdefault("name", conversation_id)
            data["deleted_at"] = None
            data["updated_at"] = datetime.now(timezone.utc).isoformat()
            path.write_text(json.dumps(data, indent=2))

    def _load_raw(self, path: Path, user_id: str, conversation_id: str) -> dict[str, Any]:
        if path.exists():
            return json.loads(path.read_text())
        return {
            "user_id": user_id,
            "conversation_id": conversation_id,
            "name": conversation_id,
            "deleted_at": None,
            "turns": [],
        }

    def _session_summary(self, data: dict[str, Any]) -> dict[str, Any]:
        turns = data.get("turns", [])
        return {
            "conversation_id": data.get("conversation_id", "default"),
            "name": data.get("name") or data.get("conversation_id", "default"),
            "deleted_at": data.get("deleted_at"),
            "updated_at": turns[-1]["created_at"] if turns else data.get("updated_at"),
            "turn_count": len(turns),
        }

    def _session_detail(self, data: dict[str, Any], limit: int = 80) -> dict[str, Any]:
        turns = data.get("turns", [])
        summary = self._session_summary(data)
        summary["turns"] = turns[-limit:]
        return summary


memory_store = ConversationMemoryStore()

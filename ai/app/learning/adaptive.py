from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from threading import Lock
from typing import Any

from app.core.config import settings


SKILL_KEYWORDS = {
    "javascript": {"javascript", "js", "node", "nodejs"},
    "typescript": {"typescript", "ts"},
    "react": {"react", "nextjs", "next.js"},
    "python": {"python", "django", "fastapi"},
    "databases": {"database", "databases", "mysql", "sql", "postgres", "stored", "procedure"},
    "system_design": {"architecture", "scaling", "system", "design"},
    "interviewing": {"interview", "resume", "portfolio"},
}


@dataclass
class SkillBelief:
    skill: str
    alpha: float = 1.0
    beta: float = 1.0

    @property
    def mastery_probability(self) -> float:
        return self.alpha / max(self.alpha + self.beta, 1.0)


class AdaptiveLearningEngine:
    """Bayesian learner model per user.

    Each skill is represented as a Beta distribution. Evidence from conversation
    updates alpha for demonstrated confidence and beta for uncertainty/remedial
    needs. We persist only compact skill probabilities, not raw cross-session
    chat text, to avoid conversation leakage.
    """

    def __init__(self) -> None:
        self.root = Path(settings.learner_state_path)
        self._lock = Lock()

    def state_path(self, user_id: str) -> Path:
        safe = re.sub(r"[^a-zA-Z0-9_.-]+", "-", user_id.strip())[:120] or "anonymous"
        return self.root / f"{safe}.json"

    def load(self, user_id: str) -> dict[str, SkillBelief]:
        path = self.state_path(user_id)
        if not path.exists():
            return {}
        with self._lock:
            data = json.loads(path.read_text())
        return {skill: SkillBelief(**value) for skill, value in data.get("skills", {}).items()}

    def profile(self, user_id: str) -> dict[str, Any]:
        beliefs = self.load(user_id)
        skills = [
            {
                "skill": belief.skill,
                "mastery_probability": round(belief.mastery_probability, 4),
                "alpha": belief.alpha,
                "beta": belief.beta,
            }
            for belief in beliefs.values()
        ]
        skills.sort(key=lambda item: item["mastery_probability"])
        return {"user_id": user_id, "skills": skills, "weakest_skills": skills[:3]}

    def update_from_turn(
        self,
        user_id: str,
        message: str,
        assistant_message: str,
        tool_events: list[dict[str, Any]],
    ) -> dict[str, Any]:
        mentioned = self._skills_in_text(f"{message} {assistant_message}")
        if not mentioned:
            return self.profile(user_id)

        uncertainty = self._uncertainty_signal(message)
        evidence = self._success_signal(message, tool_events)
        beliefs = self.load(user_id)
        for skill in mentioned:
            belief = beliefs.get(skill, SkillBelief(skill=skill))
            belief.alpha += evidence
            belief.beta += uncertainty
            beliefs[skill] = belief
        self._save(user_id, beliefs)
        return self.profile(user_id)

    def _skills_in_text(self, text: str) -> set[str]:
        tokens = set(re.findall(r"[a-zA-Z0-9.]+", text.lower()))
        return {
            skill
            for skill, keywords in SKILL_KEYWORDS.items()
            if tokens & keywords
        }

    def _uncertainty_signal(self, message: str) -> float:
        lowered = message.lower()
        if any(term in lowered for term in ("confused", "stuck", "don't understand", "do not understand", "hard")):
            return 1.2
        if "?" in message:
            return 0.7
        return 0.25

    def _success_signal(self, message: str, tool_events: list[dict[str, Any]]) -> float:
        lowered = message.lower()
        if any(term in lowered for term in ("i built", "completed", "finished", "understand", "solved")):
            return 1.2
        if any(event.get("name") in {"course_qa", "search_lms", "get_lms_status"} for event in tool_events):
            return 0.55
        return 0.35

    def _save(self, user_id: str, beliefs: dict[str, SkillBelief]) -> None:
        path = self.state_path(user_id)
        with self._lock:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(
                json.dumps(
                    {"user_id": user_id, "skills": {skill: asdict(belief) for skill, belief in beliefs.items()}},
                    indent=2,
                )
            )


adaptive_engine = AdaptiveLearningEngine()

"""Mentor <-> mentee hybrid matching engine."""
from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class Candidate:
    candidate_id: str
    score: float
    reasons: list[str]
    similarity_score: float = 0.0
    rule_score: float = 0.0
    feedback_score: float = 0.0


@dataclass(frozen=True)
class MatchingWeights:
    similarity: float = 0.58
    rules: float = 0.34
    feedback: float = 0.08


SKILL_SYNONYMS = {
    "js": "javascript",
    "node": "nodejs",
    "node.js": "nodejs",
    "react.js": "react",
    "next": "nextjs",
    "next.js": "nextjs",
    "front-end": "frontend",
    "front end": "frontend",
    "fe": "frontend",
    "back-end": "backend",
    "back end": "backend",
    "be": "backend",
    "typescript": "typescript",
    "ts": "typescript",
}

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "for",
    "from",
    "in",
    "is",
    "of",
    "on",
    "or",
    "the",
    "to",
    "with",
}


def build_document(profile: dict) -> str:
    """Flatten a mentor/mentee profile into a weighted normalized document."""
    parts: list[str] = []
    weighted_fields = {
        "career_path": 4,
        "career_preferences": 4,
        "desired_skills": 5,
        "expertise": 5,
        "industry_pref": 2,
        "industries": 2,
        "experience_level": 2,
        "education_status": 1,
        "title": 2,
        "goals": 3,
        "bio": 2,
        "description": 2,
        "work_experience": 2,
        "languages": 1,
    }
    for key, weight in weighted_fields.items():
        val = profile.get(key)
        if isinstance(val, list):
            text = " ".join(str(v) for v in val)
        elif val:
            text = str(val)
        else:
            continue
        parts.extend([normalize_text(text)] * weight)
    return " ".join(parts)


def normalize_text(text: str) -> str:
    text = text.lower()
    for source, target in SKILL_SYNONYMS.items():
        text = text.replace(source, target)
    tokens = re.findall(r"[a-z0-9+#.]+", text)
    return " ".join(SKILL_SYNONYMS.get(token, token) for token in tokens if token not in STOPWORDS)


def rank_mentors(
    mentee: dict,
    mentors: list[dict],
    limit: int = 10,
) -> list[Candidate]:
    """Return mentors ranked by hybrid similarity + structured fit."""
    if not mentors:
        return []

    viable_mentors = [mentor for mentor in mentors if _passes_hard_filters(mentee, mentor)]
    if not viable_mentors:
        return []

    mentor_docs = [build_document(m) for m in viable_mentors]
    mentee_doc = build_document(mentee)
    sims = _similarities(mentee_doc, mentor_docs)

    weights = MatchingWeights()

    ranked = sorted(
        (
            _candidate_for(mentee, m, i, sims[i], weights)
            for i, m in enumerate(viable_mentors)
        ),
        key=lambda c: c.score,
        reverse=True,
    )
    return ranked[:limit]


def rank_mentees(
    mentor: dict,
    mentees: list[dict],
    limit: int = 10,
) -> list[Candidate]:
    """Return mentees ranked for a mentor using the same hybrid scorer."""
    if not mentees:
        return []
    pseudo_mentor_docs = [build_document(_mentee_as_query_doc(mentee)) for mentee in mentees]
    mentor_doc = build_document(_mentor_as_query_doc(mentor))
    sims = _similarities(mentor_doc, pseudo_mentor_docs)
    weights = MatchingWeights()
    ranked = sorted(
        (
            Candidate(
                candidate_id=str(mentee.get("id", i)),
                similarity_score=round(float(sims[i]), 4),
                rule_score=round(_reverse_rule_score(mentor, mentee), 4),
                feedback_score=round(_feedback_score(mentor, mentee), 4),
                score=round(
                    _final_score(float(sims[i]), _reverse_rule_score(mentor, mentee), _feedback_score(mentor, mentee), weights),
                    4,
                ),
                reasons=_reverse_reasons(mentor, mentee),
            )
            for i, mentee in enumerate(mentees)
        ),
        key=lambda c: c.score,
        reverse=True,
    )
    return ranked[:limit]


def _similarities(query_doc: str, docs: list[str]) -> list[float]:
    if not docs:
        return []
    if not query_doc.strip() or not any(doc.strip() for doc in docs):
        return [0.0 for _ in docs]
    try:
        vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)
        matrix = vectorizer.fit_transform(docs)
        query = vectorizer.transform([query_doc])
        return [float(v) for v in cosine_similarity(query, matrix).ravel()]
    except ValueError:
        return [0.0 for _ in docs]


def _candidate_for(
    mentee: dict,
    mentor: dict,
    index: int,
    similarity: float,
    weights: MatchingWeights,
) -> Candidate:
    rules = _rule_score(mentee, mentor)
    feedback = _feedback_score(mentee, mentor)
    return Candidate(
        candidate_id=str(mentor.get("id", index)),
        similarity_score=round(similarity, 4),
        rule_score=round(rules, 4),
        feedback_score=round(feedback, 4),
        score=round(_final_score(similarity, rules, feedback, weights), 4),
        reasons=_reasons(mentee, mentor),
    )


def _final_score(similarity: float, rules: float, feedback: float, weights: MatchingWeights) -> float:
    score = weights.similarity * similarity + weights.rules * rules + weights.feedback * feedback
    return max(0.0, min(score, 1.0))


def _passes_hard_filters(mentee: dict, mentor: dict) -> bool:
    if mentor.get("active") is False or mentor.get("status") in {"inactive", "suspended"}:
        return False
    if mentor.get("capacity") == 0 or mentor.get("has_capacity") is False:
        return False
    required_verified = mentee.get("requires_verified_mentor") or mentee.get("tier") == "verified"
    if required_verified and not mentor.get("verified"):
        return False
    mentee_languages = _set(mentee.get("languages") or ["english"])
    mentor_languages = _set(mentor.get("languages") or ["english"])
    if mentee_languages and mentor_languages and not mentee_languages & mentor_languages:
        return False
    return True


def _rule_score(mentee: dict, mentor: dict) -> float:
    components: list[float] = []
    components.append(1.0 if _set(mentee.get("desired_skills")) & _set(mentor.get("expertise")) else 0.0)
    components.append(1.0 if _career_match(mentee, mentor) else 0.0)
    components.append(1.0 if _set(mentee.get("industry_pref") or mentee.get("industries")) & _set(mentor.get("industry_pref") or mentor.get("industries")) else 0.0)
    components.append(_experience_fit(mentee, mentor))
    components.append(_availability_overlap(mentee, mentor))
    components.append(_quality_score(mentor))
    return sum(components) / len(components)


def _reverse_rule_score(mentor: dict, mentee: dict) -> float:
    components = [
        1.0 if _set(mentor.get("expertise")) & _set(mentee.get("desired_skills")) else 0.0,
        1.0 if _career_match(mentee, mentor) else 0.0,
        1.0 if _set(mentor.get("industry_pref") or mentor.get("industries")) & _set(mentee.get("industry_pref") or mentee.get("industries")) else 0.0,
        _availability_overlap(mentee, mentor),
    ]
    return sum(components) / len(components)


def _reasons(mentee: dict, mentor: dict) -> list[str]:
    """Explainability: surface why this mentor matched."""
    reasons: list[str] = []
    mentee_skills = _set(mentee.get("desired_skills"))
    mentor_skills = _set(mentor.get("expertise"))
    shared = mentee_skills & mentor_skills
    if shared:
        reasons.append("shares: " + ", ".join(sorted(shared)))
    if _career_match(mentee, mentor):
        reasons.append(f"mentors for {normalize_text(str(mentee.get('career_path', 'your path')))}")
    industries = _set(mentee.get("industry_pref") or mentee.get("industries")) & _set(
        mentor.get("industry_pref") or mentor.get("industries")
    )
    if industries:
        reasons.append("industry fit: " + ", ".join(sorted(industries)))
    availability = _availability_overlap(mentee, mentor)
    if availability > 0:
        reasons.append("availability overlaps")
    if mentor.get("verified"):
        reasons.append("verified mentor")
    rating = _number(mentor.get("rating"))
    if rating >= 4.5:
        reasons.append(f"highly rated: {rating:g}")
    if not reasons:
        reasons.append("closest profile fit")
    return reasons


def _reverse_reasons(mentor: dict, mentee: dict) -> list[str]:
    reasons = []
    shared = _set(mentor.get("expertise")) & _set(mentee.get("desired_skills"))
    if shared:
        reasons.append("wants help with: " + ", ".join(sorted(shared)))
    if _career_match(mentee, mentor):
        reasons.append(f"career path fit: {normalize_text(str(mentee.get('career_path', '')))}")
    if _availability_overlap(mentee, mentor) > 0:
        reasons.append("availability overlaps")
    return reasons or ["closest profile fit"]


def _career_match(mentee: dict, mentor: dict) -> bool:
    career = normalize_text(str(mentee.get("career_path", "")))
    return bool(career and career in _set(mentor.get("career_preferences")))


def _experience_fit(mentee: dict, mentor: dict) -> float:
    levels = {"beginner": 1, "junior": 2, "intermediate": 3, "mid": 3, "senior": 4, "lead": 5}
    need = levels.get(normalize_text(str(mentee.get("experience_level", "junior"))), 2)
    mentor_level = levels.get(normalize_text(str(mentor.get("seniority") or mentor.get("experience_level") or "senior")), 4)
    if mentor_level >= need:
        return 1.0
    return max(0.0, mentor_level / max(need, 1))


def _availability_overlap(mentee: dict, mentor: dict) -> float:
    mentee_slots = _set(mentee.get("availability"))
    mentor_slots = _set(mentor.get("availability"))
    if not mentee_slots or not mentor_slots:
        return 0.5
    return len(mentee_slots & mentor_slots) / max(len(mentee_slots), 1)


def _quality_score(mentor: dict) -> float:
    rating = min(_number(mentor.get("rating")) / 5.0, 1.0)
    verified = 1.0 if mentor.get("verified") else 0.0
    response = 1.0 - min(_number(mentor.get("response_time_hours")) / 72.0, 1.0)
    capacity = 0.4 if mentor.get("capacity") == 1 else 1.0
    return (rating + verified + response + capacity) / 4


def _feedback_score(a: dict, b: dict) -> float:
    feedback = b.get("feedback_score", a.get("feedback_score", 0.0))
    return max(0.0, min(_number(feedback), 1.0))


def _set(value: Any) -> set[str]:
    if not value:
        return set()
    if isinstance(value, str):
        values = [value]
    else:
        values = list(value)
    return {normalize_text(str(item)) for item in values if normalize_text(str(item))}


def _number(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def _mentee_as_query_doc(mentee: dict) -> dict:
    return {
        "expertise": mentee.get("desired_skills", []),
        "career_preferences": [mentee.get("career_path", "")],
        "industry_pref": mentee.get("industry_pref") or mentee.get("industries", []),
        "description": mentee.get("goals") or mentee.get("bio", ""),
    }


def _mentor_as_query_doc(mentor: dict) -> dict:
    return {
        "desired_skills": mentor.get("expertise", []),
        "career_path": " ".join(mentor.get("career_preferences", [])),
        "industry_pref": mentor.get("industry_pref") or mentor.get("industries", []),
        "goals": mentor.get("description") or mentor.get("bio", ""),
    }

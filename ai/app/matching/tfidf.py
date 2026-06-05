"""
Mentor <-> mentee matching: TF-IDF + cosine similarity core.

This is the v1 in-process implementation described in
docs/MATCHING_ALGORITHM.md. It fits a TF-IDF vectorizer over the mentor corpus
and scores a mentee query against it. The hybrid rule layer and Qdrant-backed
vectors come in later iterations.
"""
from __future__ import annotations

from dataclasses import dataclass

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class Candidate:
    candidate_id: str
    score: float
    reasons: list[str]


def build_document(profile: dict) -> str:
    """Flatten a mentor/mentee profile into a normalized text document.

    Real version: lowercase, strip, lemmatize, and normalize skills via the
    taxonomy (see docs/MATCHING_ALGORITHM.md §2). Kept simple here.
    """
    parts: list[str] = []
    for key in (
        "career_path",
        "career_preferences",
        "desired_skills",
        "expertise",
        "industry_pref",
        "title",
        "description",
    ):
        val = profile.get(key)
        if isinstance(val, list):
            parts.extend(str(v) for v in val)
        elif val:
            parts.append(str(val))
    return " ".join(parts).lower()


def rank_mentors(
    mentee: dict,
    mentors: list[dict],
    limit: int = 10,
) -> list[Candidate]:
    """Return mentors ranked by cosine similarity to the mentee profile."""
    if not mentors:
        return []

    mentor_docs = [build_document(m) for m in mentors]
    mentee_doc = build_document(mentee)

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)
    matrix = vectorizer.fit_transform(mentor_docs)
    query = vectorizer.transform([mentee_doc])

    sims = cosine_similarity(query, matrix).ravel()

    ranked = sorted(
        (
            Candidate(
                candidate_id=str(m.get("id", i)),
                score=float(sims[i]),
                reasons=_reasons(mentee, m),
            )
            for i, m in enumerate(mentors)
        ),
        key=lambda c: c.score,
        reverse=True,
    )
    return ranked[:limit]


def _reasons(mentee: dict, mentor: dict) -> list[str]:
    """Explainability: surface why this mentor matched."""
    reasons: list[str] = []
    mentee_skills = {s.lower() for s in mentee.get("desired_skills", [])}
    mentor_skills = {s.lower() for s in mentor.get("expertise", [])}
    shared = mentee_skills & mentor_skills
    if shared:
        reasons.append("shares: " + ", ".join(sorted(shared)))
    if mentee.get("career_path") and mentee["career_path"] in mentor.get(
        "career_preferences", []
    ):
        reasons.append(f"mentors for {mentee['career_path']}")
    return reasons

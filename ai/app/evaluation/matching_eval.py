from __future__ import annotations

import math
import time
from dataclasses import dataclass
from typing import Any

from app.matching.tfidf import rank_mentors


@dataclass(frozen=True)
class MatchingCase:
    name: str
    mentee: dict[str, Any]
    mentors: list[dict[str, Any]]
    relevant_ids: set[str]


FIXTURE: list[MatchingCase] = [
    MatchingCase(
        name="frontend-react",
        mentee={
            "id": "mentee-frontend",
            "career_path": "frontend",
            "desired_skills": ["React", "TypeScript"],
            "industry_pref": ["saas"],
            "languages": ["English"],
            "availability": ["weekends"],
            "experience_level": "junior",
        },
        mentors=[
            {
                "id": "mentor-react",
                "expertise": ["React", "TypeScript", "Next.js"],
                "career_preferences": ["frontend"],
                "industry_pref": ["saas"],
                "languages": ["English"],
                "availability": ["weekends"],
                "verified": True,
                "rating": 4.9,
                "seniority": "senior",
            },
            {
                "id": "mentor-data",
                "expertise": ["Python", "Pandas"],
                "career_preferences": ["data"],
                "languages": ["English"],
                "availability": ["evenings"],
                "rating": 4.5,
            },
            {
                "id": "mentor-backend",
                "expertise": ["Go", "Postgres"],
                "career_preferences": ["backend"],
                "languages": ["English"],
                "availability": ["weekends"],
            },
        ],
        relevant_ids={"mentor-react"},
    ),
    MatchingCase(
        name="backend-database",
        mentee={
            "id": "mentee-backend",
            "career_path": "backend",
            "desired_skills": ["Python", "MySQL", "FastAPI"],
            "industry_pref": ["fintech"],
            "languages": ["English"],
            "availability": ["evenings"],
        },
        mentors=[
            {
                "id": "mentor-python-api",
                "expertise": ["Python", "FastAPI", "MySQL"],
                "career_preferences": ["backend"],
                "industry_pref": ["fintech"],
                "languages": ["English"],
                "availability": ["evenings"],
                "verified": True,
                "rating": 4.8,
            },
            {
                "id": "mentor-react",
                "expertise": ["React", "TypeScript"],
                "career_preferences": ["frontend"],
                "languages": ["English"],
                "availability": ["evenings"],
            },
            {
                "id": "mentor-mobile",
                "expertise": ["Flutter", "Firebase"],
                "career_preferences": ["mobile"],
                "languages": ["English"],
                "availability": ["weekends"],
            },
        ],
        relevant_ids={"mentor-python-api"},
    ),
    MatchingCase(
        name="language-filter",
        mentee={
            "id": "mentee-fr",
            "career_path": "frontend",
            "desired_skills": ["React"],
            "languages": ["French"],
            "availability": ["weekdays"],
        },
        mentors=[
            {
                "id": "mentor-react-en",
                "expertise": ["React"],
                "career_preferences": ["frontend"],
                "languages": ["English"],
                "availability": ["weekdays"],
            },
            {
                "id": "mentor-react-fr",
                "expertise": ["React", "JavaScript"],
                "career_preferences": ["frontend"],
                "languages": ["French"],
                "availability": ["weekdays"],
                "verified": True,
            },
        ],
        relevant_ids={"mentor-react-fr"},
    ),
    MatchingCase(
        name="data-science",
        mentee={
            "id": "mentee-data",
            "career_path": "data",
            "desired_skills": ["Python", "SQL", "machine learning"],
            "industry_pref": ["healthtech"],
            "languages": ["English"],
            "experience_level": "beginner",
        },
        mentors=[
            {
                "id": "mentor-ml",
                "expertise": ["Python", "SQL", "machine learning"],
                "career_preferences": ["data"],
                "industry_pref": ["healthtech"],
                "languages": ["English"],
                "rating": 4.7,
            },
            {
                "id": "mentor-node",
                "expertise": ["Node.js", "MongoDB"],
                "career_preferences": ["backend"],
                "languages": ["English"],
            },
        ],
        relevant_ids={"mentor-ml"},
    ),
]


def evaluate_matching_fixture(limit: int = 3) -> dict[str, Any]:
    started = time.perf_counter()
    rows = []
    precision_at_1 = []
    precision_at_k = []
    reciprocal_ranks = []
    ndcgs = []

    for case in FIXTURE:
        ranked = rank_mentors(case.mentee, case.mentors, limit)
        ranked_ids = [candidate.candidate_id for candidate in ranked]
        relevant_rank_indexes = [
            index for index, candidate_id in enumerate(ranked_ids) if candidate_id in case.relevant_ids
        ]
        precision_at_1.append(1.0 if ranked_ids[:1] and ranked_ids[0] in case.relevant_ids else 0.0)
        precision_at_k.append(len(set(ranked_ids[:limit]) & case.relevant_ids) / min(limit, len(case.relevant_ids)))
        reciprocal_ranks.append(1.0 / (relevant_rank_indexes[0] + 1) if relevant_rank_indexes else 0.0)
        ndcgs.append(_ndcg(ranked_ids, case.relevant_ids, limit))
        rows.append(
            {
                "case": case.name,
                "ranked_ids": ranked_ids,
                "relevant_ids": sorted(case.relevant_ids),
                "top_score": ranked[0].score if ranked else 0.0,
                "top_reasons": ranked[0].reasons if ranked else [],
            }
        )

    duration_ms = (time.perf_counter() - started) * 1000
    return {
        "algorithm": "hybrid_tfidf_cosine_plus_rules",
        "case_count": len(FIXTURE),
        "metrics": {
            "precision_at_1": round(sum(precision_at_1) / len(precision_at_1), 4),
            f"precision_at_{limit}": round(sum(precision_at_k) / len(precision_at_k), 4),
            "mrr": round(sum(reciprocal_ranks) / len(reciprocal_ranks), 4),
            f"ndcg_at_{limit}": round(sum(ndcgs) / len(ndcgs), 4),
            "latency_ms_total": round(duration_ms, 3),
            "latency_ms_per_case": round(duration_ms / len(FIXTURE), 3),
        },
        "cases": rows,
    }


def _ndcg(ranked_ids: list[str], relevant_ids: set[str], limit: int) -> float:
    dcg = 0.0
    for index, candidate_id in enumerate(ranked_ids[:limit]):
        relevance = 1.0 if candidate_id in relevant_ids else 0.0
        dcg += relevance / math.log2(index + 2)
    ideal_relevant = min(len(relevant_ids), limit)
    idcg = sum(1.0 / math.log2(index + 2) for index in range(ideal_relevant))
    return dcg / idcg if idcg else 0.0

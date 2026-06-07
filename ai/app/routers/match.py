from fastapi import APIRouter
from pydantic import BaseModel

from app.matching.tfidf import rank_mentees, rank_mentors

router = APIRouter(prefix="/v1", tags=["matching"])


class MatchRequest(BaseModel):
    mentee: dict
    mentors: list[dict]
    limit: int = 10


class MatchCandidate(BaseModel):
    candidate_id: str
    score: float
    reasons: list[str]
    similarity_score: float = 0.0
    rule_score: float = 0.0
    feedback_score: float = 0.0


class MatchResponse(BaseModel):
    candidates: list[MatchCandidate]


@router.post("/match", response_model=MatchResponse)
async def match(req: MatchRequest) -> MatchResponse:
    """Rank mentors for a mentee (TF-IDF + cosine). Service-JWT auth added later.

    For now profiles are passed in the request; the production version will pull
    them from the server / Qdrant. See docs/MATCHING_ALGORITHM.md.
    """
    ranked = rank_mentors(req.mentee, req.mentors, req.limit)
    return MatchResponse(
        candidates=[
            MatchCandidate(
                candidate_id=c.candidate_id,
                score=c.score,
                reasons=c.reasons,
                similarity_score=c.similarity_score,
                rule_score=c.rule_score,
                feedback_score=c.feedback_score,
            )
            for c in ranked
        ]
    )


class RecommendRequest(BaseModel):
    user: dict
    candidates: list[dict]
    role: str = "mentee"
    limit: int = 10


@router.post("/recommendations", response_model=MatchResponse)
async def recommendations(req: RecommendRequest) -> MatchResponse:
    if req.role == "mentor":
        ranked = rank_mentees(req.user, req.candidates, req.limit)
    else:
        ranked = rank_mentors(req.user, req.candidates, req.limit)
    return MatchResponse(
        candidates=[
            MatchCandidate(
                candidate_id=c.candidate_id,
                score=c.score,
                reasons=c.reasons,
                similarity_score=c.similarity_score,
                rule_score=c.rule_score,
                feedback_score=c.feedback_score,
            )
            for c in ranked
        ]
    )

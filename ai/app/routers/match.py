from fastapi import APIRouter
from pydantic import BaseModel

from app.matching.tfidf import rank_mentors

router = APIRouter(prefix="/v1", tags=["matching"])


class MatchRequest(BaseModel):
    mentee: dict
    mentors: list[dict]
    limit: int = 10


class MatchCandidate(BaseModel):
    candidate_id: str
    score: float
    reasons: list[str]


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
            MatchCandidate(candidate_id=c.candidate_id, score=c.score, reasons=c.reasons)
            for c in ranked
        ]
    )

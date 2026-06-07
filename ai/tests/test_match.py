from fastapi.testclient import TestClient

from app.main import app
from app.matching.tfidf import rank_mentees, rank_mentors


client = TestClient(app)


def test_rank_mentors_prefers_shared_skills():
    ranked = rank_mentors(
        {
            "career_path": "frontend",
            "desired_skills": ["React", "TypeScript"],
            "languages": ["English"],
            "availability": ["weekends"],
        },
        [
            {"id": "backend", "expertise": ["Go", "Postgres"], "career_preferences": ["backend"]},
            {
                "id": "frontend",
                "expertise": ["React", "TypeScript", "Next.js"],
                "career_preferences": ["frontend"],
                "languages": ["English"],
                "availability": ["weekends"],
                "verified": True,
                "rating": 4.9,
            },
        ],
    )
    assert ranked[0].candidate_id == "frontend"
    assert ranked[0].score > ranked[1].score
    assert "react" in ranked[0].reasons[0]
    assert ranked[0].similarity_score > 0
    assert ranked[0].rule_score > 0


def test_rank_mentors_applies_hard_filters():
    ranked = rank_mentors(
        {"career_path": "frontend", "desired_skills": ["React"], "languages": ["English"]},
        [
            {
                "id": "inactive",
                "active": False,
                "expertise": ["React"],
                "career_preferences": ["frontend"],
                "languages": ["English"],
            },
            {
                "id": "language-mismatch",
                "expertise": ["React"],
                "career_preferences": ["frontend"],
                "languages": ["French"],
            },
            {
                "id": "good",
                "expertise": ["React"],
                "career_preferences": ["frontend"],
                "languages": ["English"],
            },
        ],
    )
    assert [candidate.candidate_id for candidate in ranked] == ["good"]


def test_rank_mentees_for_mentor():
    ranked = rank_mentees(
        {"expertise": ["Python", "Django"], "career_preferences": ["backend"]},
        [
            {"id": "frontend", "desired_skills": ["React"], "career_path": "frontend"},
            {"id": "backend", "desired_skills": ["Python"], "career_path": "backend"},
        ],
    )
    assert ranked[0].candidate_id == "backend"
    assert ranked[0].score > ranked[1].score


def test_recommendations_endpoint_supports_mentee_role():
    response = client.post(
        "/v1/recommendations",
        json={
            "role": "mentee",
            "user": {"career_path": "frontend", "desired_skills": ["React"]},
            "candidates": [
                {"id": "a", "expertise": ["Go"], "career_preferences": ["backend"]},
                {"id": "b", "expertise": ["React"], "career_preferences": ["frontend"]},
            ],
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["candidates"][0]["candidate_id"] == "b"
    assert "similarity_score" in body["candidates"][0]

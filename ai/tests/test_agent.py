from __future__ import annotations

from fastapi.testclient import TestClient

from app.agent import tools
from app.agent.tools import ToolContext
from app.main import app


client = TestClient(app)


def test_tool_registry_includes_lms_user_rag_and_web_tools():
    names = {tool.name for tool in tools.all_tools()}
    assert {
        "get_user_info",
        "get_lms_status",
        "search_lms",
        "course_qa",
        "web_search",
        "book_session",
    }.issubset(names)


def test_list_tools_endpoint_marks_mutating_tools():
    response = client.get("/v1/agent/tools")
    assert response.status_code == 200
    body = response.json()
    by_name = {item["name"]: item for item in body["local_tools"]}
    assert "mcp_servers" in body
    assert by_name["book_session"]["mutates"] is True
    assert by_name["book_session"]["requires_confirmation"] is True
    assert by_name["course_qa"]["mutates"] is False


def test_rag_ingest_and_agent_local_fallback_course_answer(tmp_path, monkeypatch):
    from app.rag import faiss_store

    monkeypatch.setattr(faiss_store.rag_store, "index_path", tmp_path / "faiss.index")
    monkeypatch.setattr(faiss_store.rag_store, "store_path", tmp_path / "chunks.json")
    monkeypatch.setattr(faiss_store.rag_store, "_loaded", False)
    monkeypatch.setattr(faiss_store.rag_store, "_chunks", [])
    monkeypatch.setattr(faiss_store.rag_store, "_index", None)
    monkeypatch.setattr("app.agent.loop.settings.anthropic_api_key", "")
    monkeypatch.setattr("app.rag.faiss_store.settings.google_api_key", "")

    ingest = client.post(
        "/v1/rag/chunks",
        json={
            "chunks": [
                {
                    "id": "lesson-js-1",
                    "title": "JavaScript Foundations",
                    "source": "lms/javascript/foundations",
                    "text": "JavaScript variables, functions, arrays, and DOM practice are core frontend foundations.",
                }
            ]
        },
    )
    assert ingest.status_code == 200
    assert ingest.json()["inserted"] == 1

    response = client.post(
        "/v1/agent/chat",
        json={
            "user_id": "u1",
            "conversation_id": "c1",
            "message": "Which JavaScript course lesson should I learn first?",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "local_fallback"
    assert "JavaScript" in body["message"]
    assert body["tool_events"][0]["name"] == "course_qa"


def test_lookup_mentor_tool_can_rank_local_candidates():
    import anyio

    result = anyio.run(
        tools.execute,
        "lookup_mentor",
        {
            "mentee_profile": {"career_path": "frontend", "desired_skills": ["React"]},
            "mentors": [
                {"id": "backend", "expertise": ["Go"], "career_preferences": ["backend"]},
                {"id": "frontend", "expertise": ["React"], "career_preferences": ["frontend"]},
            ],
        },
        ToolContext(user_id="u1", conversation_id="c1"),
    )
    assert result["ok"] is True
    assert result["candidates"][0]["candidate_id"] == "frontend"
    assert result["source"] == "local_hybrid_ranker"


def test_rag_chunks_are_scoped_by_user_and_conversation(tmp_path, monkeypatch):
    from app.rag import faiss_store

    monkeypatch.setattr(faiss_store.rag_store, "index_path", tmp_path / "faiss.index")
    monkeypatch.setattr(faiss_store.rag_store, "store_path", tmp_path / "chunks.json")
    monkeypatch.setattr(faiss_store.rag_store, "_loaded", False)
    monkeypatch.setattr(faiss_store.rag_store, "_chunks", [])
    monkeypatch.setattr(faiss_store.rag_store, "_index", None)
    monkeypatch.setattr("app.rag.faiss_store.settings.google_api_key", "")

    ingest = client.post(
        "/v1/rag/chunks",
        json={
            "user_id": "u-a",
            "conversation_id": "c-a",
            "chunks": [
                {
                    "id": "private-a",
                    "title": "Private Session A",
                    "source": "chat/a",
                    "text": "Kubernetes deployment debugging belongs only to session A.",
                }
            ],
        },
    )
    assert ingest.status_code == 200

    visible = faiss_store.rag_store.search("Kubernetes deployment debugging", 4, "u-a", "c-a")
    leaked = faiss_store.rag_store.search("Kubernetes deployment debugging", 4, "u-a", "c-b")
    other_user = faiss_store.rag_store.search("Kubernetes deployment debugging", 4, "u-b", "c-a")

    assert [chunk["id"] for chunk in visible] == ["private-a"]
    assert leaked == []
    assert other_user == []


def test_document_upload_chunks_and_scopes_text_file(tmp_path, monkeypatch):
    from app.rag import faiss_store

    monkeypatch.setattr(faiss_store.rag_store, "index_path", tmp_path / "faiss.index")
    monkeypatch.setattr(faiss_store.rag_store, "store_path", tmp_path / "chunks.json")
    monkeypatch.setattr(faiss_store.rag_store, "_loaded", False)
    monkeypatch.setattr(faiss_store.rag_store, "_chunks", [])
    monkeypatch.setattr(faiss_store.rag_store, "_index", None)
    monkeypatch.setattr("app.rag.faiss_store.settings.google_api_key", "")

    text = "\n\n".join(
        [
            "React upload notes",
            "Components props state effects event handling frontend practice " * 35,
            "Final section about deployment and debugging " * 25,
        ]
    )
    response = client.post(
        "/v1/rag/documents",
        data={
            "user_id": "upload-user",
            "conversation_id": "upload-chat",
            "chunk_tokens": "220",
            "overlap_tokens": "30",
        },
        files={"file": ("react-notes.txt", text.encode("utf-8"), "text/plain")},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["inserted"] > 1
    assert body["chunk_tokens"] == 220
    assert body["overlap_tokens"] == 30

    visible = faiss_store.rag_store.search("React components props", 4, "upload-user", "upload-chat")
    leaked = faiss_store.rag_store.search("React components props", 4, "upload-user", "other-chat")

    assert visible
    assert visible[0]["metadata"]["filename"] == "react-notes.txt"
    assert leaked == []


def test_document_chunker_preserves_overlap():
    from app.rag.document_ingest import ChunkingOptions, chunk_document

    text = " ".join(f"token{i}" for i in range(520))
    chunks = chunk_document(
        text=text,
        filename="tokens.txt",
        user_id="u1",
        conversation_id="c1",
        options=ChunkingOptions(chunk_tokens=220, overlap_tokens=40),
    )

    assert len(chunks) == 3
    first_tokens = chunks[0].text.split()
    second_tokens = chunks[1].text.split()
    assert first_tokens[-40:] == second_tokens[:40]


def test_adaptive_learner_updates_user_skill_state(tmp_path, monkeypatch):
    from app.learning import adaptive

    monkeypatch.setattr(adaptive.adaptive_engine, "root", tmp_path)
    profile = adaptive.adaptive_engine.update_from_turn(
        "learner-1",
        "I am confused about MySQL stored procedures",
        "Let's practice database access.",
        [],
    )

    db_skill = next(skill for skill in profile["skills"] if skill["skill"] == "databases")
    assert db_skill["mastery_probability"] < 0.5


def test_chat_sessions_can_be_renamed_and_soft_deleted(tmp_path, monkeypatch):
    from app.agent import memory

    monkeypatch.setattr(memory.memory_store, "root", tmp_path)
    memory.memory_store.append_turns("u1", "session-1", "hello", "hi")

    listed = memory.memory_store.list_sessions("u1")
    assert listed[0]["name"] == "session-1"

    renamed = memory.memory_store.rename_session("u1", "session-1", "Career plan")
    assert renamed["name"] == "Career plan"

    deleted = memory.memory_store.soft_delete_session("u1", "session-1")
    assert deleted["deleted"] is True
    assert memory.memory_store.list_sessions("u1") == []
    assert memory.memory_store.load("u1", "session-1") == []

from __future__ import annotations

from typing import Any

from anthropic import AsyncAnthropic

from app.core.config import settings
from app.core.logging import logger
from app.agent import tools
from app.agent.memory import memory_store
from app.agent.mcp import mcp_servers, mcp_toolsets
from app.agent.token_efficiency import (
    budget_store,
    compact_messages,
    estimate_tokens,
    route_difficulty,
)
from app.learning import adaptive_engine

log = logger("ai.agent")

SYSTEM_PROMPT = (
    "You are Dev2Win's AI mentor for software-career learners. Be concise, "
    "practical, and encouraging. Use tools only when needed. Cite course sources "
    "when answering from content. Escalate to a human mentor for anything outside "
    "career/learning guidance. You are an AI, not a human mentor."
)


def route_model(difficulty: str) -> str:
    """Token efficiency: cheap model for simple turns, smarter for hard ones."""
    return {
        "low": settings.model_fast,
        "medium": settings.model_smart,
        "high": settings.model_deep,
    }.get(difficulty, settings.model_smart)


async def run_turn(user_id: str, conversation: list[dict]) -> dict:
    """Compatibility wrapper for tests and non-stream callers."""
    message = ""
    if conversation:
        content = conversation[-1].get("content", "")
        message = content if isinstance(content, str) else str(content)
    return await run_agent_turn(
        user_id=user_id,
        conversation_id="default",
        message=message,
        history=conversation[:-1],
    )


async def run_agent_turn(
    user_id: str,
    conversation_id: str,
    message: str,
    history: list[dict[str, Any]] | None = None,
    auth_token: str | None = None,
) -> dict[str, Any]:
    estimated = estimate_tokens(message) + estimate_tokens(history or []) + 1_200
    budget = budget_store.check(user_id, conversation_id, estimated)
    if not budget.allowed:
        log.info("agent_budget_exceeded", user_id=user_id, conversation_id=conversation_id)
        return {
            "status": "budget_exceeded",
            "message": "This chat has reached its token budget. Please start a fresh session or try a narrower question.",
            "budget": budget.__dict__,
        }

    if not settings.anthropic_api_key:
        result = await _local_fallback(user_id, conversation_id, message, history or [], "missing Anthropic key")
        _persist_turn(user_id, conversation_id, message, result)
        return result

    model = route_model(route_difficulty(message))
    client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    ctx = tools.ToolContext(user_id=user_id, conversation_id=conversation_id, auth_token=auth_token)
    persisted_history = memory_store.load(user_id, conversation_id)
    merged_history = [*persisted_history, *(history or [])]
    messages = compact_messages([*merged_history, {"role": "user", "content": message}])
    tool_events: list[dict[str, Any]] = []
    remote_mcp_servers = mcp_servers()
    api_tools = [*tools.schemas(), *mcp_toolsets()]

    for _round in range(settings.agent_max_tool_rounds):
        create_args = {
            "model": model,
            "max_tokens": 900,
            "system": [
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            "tools": api_tools,
            "messages": messages,
        }
        if remote_mcp_servers:
            response = await client.beta.messages.create(
                **create_args,
                mcp_servers=remote_mcp_servers,
                betas=[settings.anthropic_mcp_beta],
            )
        else:
            response = await client.messages.create(**create_args)
        budget_store.record(
            user_id,
            conversation_id,
            _usage_tokens(getattr(response, "usage", None)),
        )
        messages.append({"role": "assistant", "content": _blocks_to_messages_content(response.content)})
        tool_uses = [block for block in response.content if getattr(block, "type", None) == "tool_use"]
        if not tool_uses:
            text = _response_text(response.content)
            result = {
                "status": "ok",
                "message": text,
                "model": model,
                "tool_events": tool_events,
                "usage": _usage_dict(getattr(response, "usage", None)),
            }
            _persist_turn(user_id, conversation_id, message, result)
            return result

        tool_results = []
        for call in tool_uses:
            tool = tools.get(call.name)
            if tool is None:
                result = {"error": f"unknown tool: {call.name}"}
            else:
                tool_budget = budget_store.check(user_id, conversation_id, tool.budget_cost * 500)
                if not tool_budget.allowed:
                    result = {"error": tool_budget.reason or "tool budget exceeded"}
                else:
                    result = await tools.execute(call.name, dict(call.input or {}), ctx)
                    budget_store.record(user_id, conversation_id, tool.budget_cost * 500)
            tool_events.append({"name": call.name, "input": call.input, "result": result})
            tool_results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": call.id,
                    "content": str(result),
                }
            )
        messages.append({"role": "user", "content": tool_results})

    result = {
        "status": "tool_round_limit",
        "message": "I used the available tools but need a narrower next question to continue.",
        "model": model,
        "tool_events": tool_events,
    }
    _persist_turn(user_id, conversation_id, message, result)
    return result


async def _local_fallback(
    user_id: str,
    conversation_id: str,
    message: str,
    history: list[dict[str, Any]],
    reason: str,
) -> dict[str, Any]:
    _ = history
    ctx = tools.ToolContext(user_id=user_id, conversation_id=conversation_id)
    lowered = message.lower()
    tool_events = []
    if any(term in lowered for term in ("course", "lesson", "module", "learn", "roadmap")):
        result = await tools.execute("course_qa", {"question": message, "top_k": 4}, ctx)
        tool_events.append({"name": "course_qa", "result": result})
        chunks = result.get("chunks", [])
        if chunks:
            citations = ", ".join(chunk.get("source", chunk.get("id", "")) for chunk in chunks)
            answer = f"Based on the course content, focus on: {chunks[0]['text'][:400]} Sources: {citations}."
        else:
            answer = "I could not find matching course content yet. Add course chunks to the RAG index, then ask again."
    else:
        answer = "I can help with tech-career mentoring, roadmaps, course questions, mentor lookup, and session planning."
    return {
        "status": "local_fallback",
        "message": answer,
        "model": "local-fallback",
        "reason": reason,
        "tool_events": tool_events,
    }


def _persist_turn(user_id: str, conversation_id: str, message: str, result: dict[str, Any]) -> None:
    learner = adaptive_engine.update_from_turn(
        user_id,
        message,
        str(result.get("message", "")),
        list(result.get("tool_events", [])),
    )
    result["learner"] = learner
    memory_store.append_turns(
        user_id,
        conversation_id,
        message,
        str(result.get("message", "")),
        list(result.get("tool_events", [])),
    )
    log.info(
        "agent_turn_complete",
        user_id=user_id,
        conversation_id=conversation_id,
        status=result.get("status"),
        model=result.get("model"),
        tool_count=len(result.get("tool_events", [])),
    )


def _response_text(blocks: list[Any]) -> str:
    return "".join(getattr(block, "text", "") for block in blocks if getattr(block, "type", None) == "text")


def _blocks_to_messages_content(blocks: list[Any]) -> list[dict[str, Any]]:
    content = []
    for block in blocks:
        if getattr(block, "type", None) == "text":
            content.append({"type": "text", "text": block.text})
        elif getattr(block, "type", None) == "tool_use":
            content.append({"type": "tool_use", "id": block.id, "name": block.name, "input": block.input})
        elif getattr(block, "type", None) == "mcp_tool_use":
            content.append(
                {
                    "type": "mcp_tool_use",
                    "id": block.id,
                    "name": block.name,
                    "server_name": block.server_name,
                    "input": block.input,
                }
            )
        elif getattr(block, "type", None) == "mcp_tool_result":
            content.append(
                {
                    "type": "mcp_tool_result",
                    "tool_use_id": block.tool_use_id,
                    "is_error": getattr(block, "is_error", False),
                    "content": getattr(block, "content", []),
                }
            )
    return content


def _usage_tokens(usage: Any) -> int:
    if usage is None:
        return 0
    return int(getattr(usage, "input_tokens", 0) or 0) + int(getattr(usage, "output_tokens", 0) or 0)


def _usage_dict(usage: Any) -> dict[str, int]:
    if usage is None:
        return {}
    return {
        "input_tokens": int(getattr(usage, "input_tokens", 0) or 0),
        "output_tokens": int(getattr(usage, "output_tokens", 0) or 0),
        "cache_creation_input_tokens": int(getattr(usage, "cache_creation_input_tokens", 0) or 0),
        "cache_read_input_tokens": int(getattr(usage, "cache_read_input_tokens", 0) or 0),
    }

"""
Tool registry for the AI mentor agent.

Tools are invoked on-demand by Claude's tool-use loop (never pre-called). Each
tool declares a lean JSON schema (cheap to include via prompt caching), an authz
scope, and a budget cost. Mutating tools require UI confirmation + audit.

Add tools via .claude/skills/add-ai-tool. See docs/AI_AGENT.md §5.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable, Awaitable


@dataclass
class Tool:
    name: str
    description: str
    input_schema: dict[str, Any]
    handler: Callable[[dict], Awaitable[dict]]
    mutates: bool = False
    budget_cost: int = 1


_REGISTRY: dict[str, Tool] = {}


def register(tool: Tool) -> None:
    _REGISTRY[tool.name] = tool


def schemas() -> list[dict]:
    """Anthropic tool schemas for the Messages API."""
    return [
        {"name": t.name, "description": t.description, "input_schema": t.input_schema}
        for t in _REGISTRY.values()
    ]


async def execute(name: str, args: dict) -> dict:
    tool = _REGISTRY.get(name)
    if tool is None:
        return {"error": f"unknown tool: {name}"}
    return await tool.handler(args)


# Tools (get_roadmap, course_qa, lookup_mentor, book_session, ...) are registered
# in Phase 8. Keeping the registry empty + importable for now.

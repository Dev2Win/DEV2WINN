from __future__ import annotations

import json
from typing import Any

from app.core.config import settings


def mcp_servers() -> list[dict[str, Any]]:
    """Remote Anthropic MCP server definitions from env JSON.

    Expected shape:
    [
      {"type":"url","name":"docs","url":"https://example.com/mcp","authorization_token":"..."}
    ]
    """
    try:
        raw = json.loads(settings.anthropic_mcp_servers_json or "[]")
    except json.JSONDecodeError:
        return []
    if not isinstance(raw, list):
        return []
    servers = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        if item.get("type") != "url" or not item.get("name") or not item.get("url"):
            continue
        server = {
            "type": "url",
            "name": str(item["name"]),
            "url": str(item["url"]),
        }
        if item.get("authorization_token"):
            server["authorization_token"] = str(item["authorization_token"])
        servers.append(server)
    return servers


def mcp_toolsets() -> list[dict[str, Any]]:
    toolsets = []
    for server in mcp_servers():
        toolset: dict[str, Any] = {
            "type": "mcp_toolset",
            "mcp_server_name": server["name"],
            "default_config": {
                "enabled": True,
                "defer_loading": settings.anthropic_mcp_defer_loading,
            },
            "cache_control": {"type": "ephemeral"},
        }
        toolsets.append(toolset)
    return toolsets


def public_mcp_server_info() -> list[dict[str, str]]:
    return [{"name": server["name"], "url": server["url"]} for server in mcp_servers()]

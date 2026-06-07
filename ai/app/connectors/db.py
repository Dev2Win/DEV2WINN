from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import httpx
import jwt

from app.core.config import settings


class DbConnectorError(RuntimeError):
    pass


@dataclass
class DbConnectorContext:
    user_id: str
    auth_token: str | None = None


class Dev2WinDbConnector:
    """AI-side connector for platform data.

    Default mode calls the main API so authz and stored-procedure repositories
    stay centralized. Direct stored-procedure calls are available only when
    explicitly enabled and restricted by `AI_DB_ALLOWED_PROCEDURES`.
    """

    def allowed_procedures(self) -> set[str]:
        return {
            item.strip()
            for item in settings.ai_db_allowed_procedures.split(",")
            if item.strip()
        }

    def service_jwt(self, ctx: DbConnectorContext) -> str:
        payload = {"sub": ctx.user_id, "aud": "dev2win-api", "scope": "ai:db"}
        return jwt.encode(payload, settings.service_jwt_secret, algorithm="HS256")

    async def api_get(
        self,
        path: str,
        ctx: DbConnectorContext,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        headers = {"Authorization": f"Bearer {ctx.auth_token or self.service_jwt(ctx)}"}
        async with httpx.AsyncClient(base_url=settings.server_url, timeout=8.0) as client:
            response = await client.get(path, params=params, headers=headers)
        return self._response_payload(response)

    async def api_post(
        self,
        path: str,
        ctx: DbConnectorContext,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        headers = {"Authorization": f"Bearer {ctx.auth_token or self.service_jwt(ctx)}"}
        async with httpx.AsyncClient(base_url=settings.server_url, timeout=8.0) as client:
            response = await client.post(path, json=payload, headers=headers)
        return self._response_payload(response)

    async def call_proc(self, name: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
        if not settings.ai_db_direct_enabled:
            raise DbConnectorError("Direct DB access is disabled. Use the main API connector.")
        if name not in self.allowed_procedures():
            raise DbConnectorError(f"Stored procedure is not allowlisted: {name}")

        try:
            import aiomysql
        except ImportError as exc:  # pragma: no cover
            raise DbConnectorError("aiomysql is required for direct DB access") from exc

        conn = await aiomysql.connect(
            host=settings.mysql_host,
            port=settings.mysql_port,
            user=settings.mysql_user,
            password=settings.mysql_password,
            db=settings.mysql_database,
            autocommit=True,
        )
        try:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                placeholders = ", ".join(["%s"] * len(params or []))
                await cursor.execute(f"CALL {name}({placeholders})", params or [])
                rows = await cursor.fetchall()
                return list(rows)
        finally:
            conn.close()

    async def get_user_info(self, ctx: DbConnectorContext, fields: list[str]) -> dict[str, Any]:
        return await self.api_get(f"/v1/users/{ctx.user_id}", ctx, {"fields": ",".join(fields)})

    async def get_roadmap(self, ctx: DbConnectorContext) -> dict[str, Any]:
        return await self.api_get(f"/v1/users/{ctx.user_id}/roadmap", ctx)

    async def get_lms_status(self, ctx: DbConnectorContext) -> dict[str, Any]:
        return await self.api_get(f"/v1/users/{ctx.user_id}/lms/status", ctx)

    async def summarize_progress(self, ctx: DbConnectorContext) -> dict[str, Any]:
        return await self.api_get(f"/v1/users/{ctx.user_id}/progress", ctx)

    async def lookup_mentor(self, ctx: DbConnectorContext, query: str) -> dict[str, Any]:
        return await self.api_get("/v1/matching/recommendations", ctx, {"query": query})

    async def book_session(self, ctx: DbConnectorContext, payload: dict[str, Any]) -> dict[str, Any]:
        return await self.api_post("/v1/bookings", ctx, payload)

    async def create_reminder(self, ctx: DbConnectorContext, payload: dict[str, Any]) -> dict[str, Any]:
        return await self.api_post("/v1/notifications/reminders", ctx, payload)

    async def escalate_to_human(self, ctx: DbConnectorContext, payload: dict[str, Any]) -> dict[str, Any]:
        return await self.api_post("/v1/chat/escalations", ctx, payload)

    def _response_payload(self, response: httpx.Response) -> dict[str, Any]:
        if response.status_code >= 400:
            return {"ok": False, "status": response.status_code, "message": response.text[:800]}
        return {"ok": True, "data": response.json()}


db_connector = Dev2WinDbConnector()

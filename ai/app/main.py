import time

from fastapi import FastAPI, Request

from app.core.config import settings
from app.core.logging import configure_logging, logger
from app.routers import agent, health, match

configure_logging()
log = logger("ai.http")

app = FastAPI(title="Dev2Win AI", version="0.1.0")

app.include_router(health.router)
app.include_router(match.router)
app.include_router(agent.router)


@app.middleware("http")
async def log_requests(req: Request, call_next):
    started = time.perf_counter()
    res = await call_next(req)
    log.info(
        "http_request",
        method=req.method,
        path=req.url.path,
        status_code=res.status_code,
        duration_ms=round((time.perf_counter() - started) * 1000, 2),
    )
    return res


@app.get("/")
async def root() -> dict:
    return {"service": "dev2win-ai", "env": settings.env}

from fastapi import FastAPI

from app.core.config import settings
from app.routers import health, match

app = FastAPI(title="Dev2Win AI", version="0.1.0")

app.include_router(health.router)
app.include_router(match.router)


@app.get("/")
async def root() -> dict:
    return {"service": "dev2win-ai", "env": settings.env}

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Validated configuration, loaded once at boot (fail fast)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "development"
    port: int = 8000

    anthropic_api_key: str = ""
    model_fast: str = "claude-haiku-4-5-20251001"
    model_smart: str = "claude-sonnet-4-6"
    model_deep: str = "claude-opus-4-8"

    qdrant_url: str = "http://localhost:6333"
    service_jwt_secret: str = "change-me-service-secret"
    server_url: str = "http://localhost:4000"
    redis_url: str = "redis://localhost:6379"


settings = Settings()

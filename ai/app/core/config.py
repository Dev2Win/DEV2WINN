from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Validated configuration, loaded once at boot (fail fast)."""

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local", "../.env.local"),
        extra="ignore",
        protected_namespaces=("settings_",),
    )

    env: str = "development"
    port: int = 8000

    anthropic_api_key: str = ""
    api_key: str = Field(default="", exclude=True)
    google_api_key: str = ""
    model_fast: str = "claude-haiku-4-5-20251001"
    model_smart: str = "claude-sonnet-4-20250514"
    model_deep: str = "claude-opus-4-20250514"

    qdrant_url: str = "http://localhost:6333"
    service_jwt_secret: str = "change-me-service-secret"
    server_url: str = "http://localhost:4000"
    redis_url: str = "redis://localhost:6379"
    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3307
    mysql_user: str = "dev2win"
    mysql_password: str = "dev2win"
    mysql_database: str = "dev2win"
    ai_db_direct_enabled: bool = False
    ai_db_allowed_procedures: str = (
        "sp_user_get_by_id,sp_roadmap_get_for_user,sp_lms_status_get_for_user,"
        "sp_progress_summary_get_for_user,sp_matching_recommendations_for_user"
    )
    rag_index_path: str = ".rag/faiss.index"
    rag_store_path: str = ".rag/chunks.json"
    agent_memory_path: str = ".agent/memory"
    learner_state_path: str = ".agent/learners"
    embedding_model: str = "models/embedding-001"
    web_search_model: str = "gemini-2.5-flash"
    anthropic_mcp_servers_json: str = "[]"
    anthropic_mcp_beta: str = "mcp-client-2025-11-20"
    anthropic_mcp_defer_loading: bool = True
    agent_daily_token_budget: int = 120_000
    agent_session_token_budget: int = 24_000
    agent_max_tool_rounds: int = 4

    @model_validator(mode="after")
    def use_generic_api_key_for_anthropic(self) -> "Settings":
        if not self.anthropic_api_key and self.api_key:
            self.anthropic_api_key = self.api_key
        return self


settings = Settings()

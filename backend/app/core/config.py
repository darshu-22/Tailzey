from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """All runtime configuration comes from environment variables (or backend/.env)."""

    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    app_env: Literal["development", "test", "production"] = "development"
    database_url: str = f"sqlite:///{(BACKEND_DIR / 'tailzey.db').as_posix()}"
    # Comma-separated list of exact frontend origins allowed to call the API.
    cors_allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    session_cookie_name: str = "tailzey_session"
    session_ttl_hours: int = 24 * 14
    # Forced on in production regardless of this value.
    session_cookie_secure: bool = False
    # One-click shared demo account. Unset = on in development/test, off in production.
    demo_login_enabled: bool | None = None

    auth_rate_limit_per_minute: int = 10
    analyze_rate_limit_per_minute: int = 6

    # Computer-vision pipeline
    cv_pose_model: Literal["heavy", "full", "lite"] = "heavy"
    cv_models_dir: Path = BACKEND_DIR / "models"
    cv_max_workers: int = Field(default=2, ge=1, le=16)
    cv_max_image_bytes: int = 8 * 1024 * 1024
    cv_max_image_side: int = 1280

    @field_validator("cors_allowed_origins")
    @classmethod
    def _no_wildcard(cls, v: str) -> str:
        if "*" in v:
            raise ValueError("Wildcard CORS origins are not allowed with credentialed cookies")
        return v

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.cors_allowed_origins.split(",") if o.strip()]

    @property
    def demo_enabled(self) -> bool:
        return self.demo_login_enabled if self.demo_login_enabled is not None else not self.is_production

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def cookie_secure(self) -> bool:
        return self.is_production or self.session_cookie_secure

    @property
    def pose_model_path(self) -> Path:
        return self.cv_models_dir / f"pose_landmarker_{self.cv_pose_model}.task"


@lru_cache
def get_settings() -> Settings:
    return Settings()

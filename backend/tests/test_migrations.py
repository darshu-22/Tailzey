from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import inspect, text

from app.core.database import engine
from app.models import Base

BACKEND = Path(__file__).resolve().parent.parent


def test_migrations_build_schema_matching_models():
    Base.metadata.drop_all(engine)
    with engine.begin() as conn:
        conn.execute(text("DROP TABLE IF EXISTS alembic_version"))
    cfg = Config(str(BACKEND / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND / "migrations"))
    command.upgrade(cfg, "head")
    assert {"users", "auth_sessions", "designs", "measurement_profiles"} <= set(inspect(engine).get_table_names())
    command.check(cfg)  # raises if models have changes not captured in a migration

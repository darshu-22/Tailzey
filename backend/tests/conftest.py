import os
import tempfile
from pathlib import Path

# Configure an isolated database before the app (and its engine) is imported.
_tmp = Path(tempfile.mkdtemp(prefix="tailzey-test-"))
os.environ["DATABASE_URL"] = f"sqlite:///{(_tmp / 'test.db').as_posix()}"
os.environ["APP_ENV"] = "test"
os.environ["CORS_ALLOWED_ORIGINS"] = "http://localhost:5173"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.core.database import engine  # noqa: E402
from app.core.security.rate_limit import rate_limiter  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Base  # noqa: E402


@pytest.fixture(autouse=True)
def _fresh_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    rate_limiter.reset()
    yield


def make_client() -> TestClient:
    return TestClient(app)


def register(client: TestClient, email: str = "a@example.com", password: str = "correct-horse-1", name: str = "Asha"):
    r = client.post("/api/v1/auth/register", json={"displayName": name, "email": email, "password": password})
    assert r.status_code == 201, r.text
    return r.json()["data"]


@pytest.fixture
def client() -> TestClient:
    return make_client()


@pytest.fixture
def user_client() -> TestClient:
    c = make_client()
    register(c)
    return c

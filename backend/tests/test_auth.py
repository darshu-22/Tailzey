from conftest import make_client, register

API = "/api/v1"


def test_register_sets_httponly_session_and_me_works(client):
    r = client.post(f"{API}/auth/register",
                    json={"displayName": " Asha ", "email": "Asha@Example.com", "password": "correct-horse-1"})
    assert r.status_code == 201
    user = r.json()["data"]
    assert user["email"] == "asha@example.com" and user["displayName"] == "Asha"
    assert "passwordHash" not in user and "password_hash" not in user
    cookie = r.headers["set-cookie"].lower()
    assert "httponly" in cookie and "samesite=lax" in cookie and "path=/api" in cookie

    me = client.get(f"{API}/auth/me")
    assert me.status_code == 200 and me.json()["data"]["id"] == user["id"]
    # Timestamps read back from the database must stay timezone-aware (UTC).
    assert me.json()["data"]["createdAt"].endswith(("Z", "+00:00"))


def test_duplicate_email_conflict(client):
    register(client)
    r = make_client().post(f"{API}/auth/register",
                           json={"displayName": "B", "email": "A@example.com", "password": "another-pass-2"})
    assert r.status_code == 409
    assert r.json()["error"]["fieldErrors"]["email"]


def test_login_logout_and_generic_bad_credentials(client):
    register(client)
    c = make_client()
    wrong = c.post(f"{API}/auth/login", json={"email": "a@example.com", "password": "nope-nope"})
    unknown = c.post(f"{API}/auth/login", json={"email": "zz@example.com", "password": "nope-nope"})
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json()["error"]["message"] == unknown.json()["error"]["message"]

    login = c.post(f"{API}/auth/login", json={"email": "A@example.com", "password": "correct-horse-1"})
    assert login.status_code == 200
    assert c.get(f"{API}/auth/me").status_code == 200
    assert c.post(f"{API}/auth/logout").status_code == 204
    assert c.get(f"{API}/auth/me").status_code == 401


def test_validation_error_shape(client):
    r = client.post(f"{API}/auth/register", json={"displayName": "", "email": "bad", "password": "short"})
    assert r.status_code == 422
    err = r.json()["error"]
    assert err["code"] == "VALIDATION_ERROR"
    assert {"displayName", "email", "password"} <= set(err["fieldErrors"])
    assert err["requestId"]


def test_unauthenticated_requests_rejected(client):
    for method, path in [("get", "/designs"), ("post", "/designs"), ("get", "/measurement-profiles"),
                         ("get", "/auth/me"), ("post", "/measurements/analyze")]:
        r = getattr(client, method)(f"{API}{path}")
        assert r.status_code == 401, path
        assert r.json()["error"]["code"] == "UNAUTHORIZED"


def test_login_rate_limited(client):
    for _ in range(10):
        client.post(f"{API}/auth/login", json={"email": "x@example.com", "password": "whatever1"})
    r = client.post(f"{API}/auth/login", json={"email": "x@example.com", "password": "whatever1"})
    assert r.status_code == 429 and "retry-after" in r.headers


def test_foreign_origin_blocked_for_writes(client):
    r = client.post(f"{API}/auth/login", json={"email": "a@example.com", "password": "x"},
                    headers={"Origin": "https://evil.example"})
    assert r.status_code == 403
    ok = client.post(f"{API}/auth/login", json={"email": "a@example.com", "password": "x"},
                     headers={"Origin": "http://localhost:5173"})
    assert ok.status_code == 401  # passed the origin check


def test_cors_allows_only_configured_origin(client):
    pre = {"Access-Control-Request-Method": "POST"}
    good = client.options(f"{API}/designs", headers={"Origin": "http://localhost:5173", **pre})
    bad = client.options(f"{API}/designs", headers={"Origin": "https://evil.example", **pre})
    assert good.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert good.headers.get("access-control-allow-credentials") == "true"
    assert "access-control-allow-origin" not in bad.headers


def test_delete_account_removes_everything(user_client):
    user_client.post(f"{API}/measurement-profiles", json={"unit": "cm", "values": {"height": 170}})
    assert user_client.delete(f"{API}/auth/me").status_code == 204
    assert user_client.get(f"{API}/auth/me").status_code == 401
    c = make_client()
    login = c.post(f"{API}/auth/login", json={"email": "a@example.com", "password": "correct-horse-1"})
    assert login.status_code == 401


def test_health_and_catalog(client):
    h = client.get(f"{API}/health").json()["data"]
    assert h["database"] == "ok"
    cat = client.get(f"{API}/catalog").json()["data"]
    assert {g["id"] for g in cat["garments"]} == {"t-shirt", "shirt", "jacket", "trousers", "ethnic"}


def test_demo_login_creates_and_reuses_one_account(client):
    first = client.post(f"{API}/auth/demo")
    assert first.status_code == 200
    assert first.json()["data"]["email"] == "demo@tailzey.dev"
    assert client.get(f"{API}/auth/me").json()["data"]["id"] == first.json()["data"]["id"]
    again = make_client().post(f"{API}/auth/demo")
    assert again.json()["data"]["id"] == first.json()["data"]["id"]
    # The demo account has no known password.
    bad = make_client().post(f"{API}/auth/login", json={"email": "demo@tailzey.dev", "password": "demo-password"})
    assert bad.status_code == 401


def test_demo_login_can_be_disabled(client, monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setattr(get_settings(), "demo_login_enabled", False)
    assert client.post(f"{API}/auth/demo").status_code == 404

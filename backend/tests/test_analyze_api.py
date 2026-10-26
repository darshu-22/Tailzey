"""POST /measurements/analyze — request validation and honest failure reporting."""

import io

import cv2
import numpy as np
import pytest

from app.core.config import get_settings

API = "/api/v1"


def _jpeg(img: np.ndarray) -> bytes:
    ok, buf = cv2.imencode(".jpg", img)
    assert ok
    return buf.tobytes()


def _post(client, files, **form):
    data = {"heightCm": "175", "consent": "true", **form}
    return client.post(f"{API}/measurements/analyze", data=data, files=files)


def test_analyze_validation(user_client):
    img = ("f.jpg", io.BytesIO(_jpeg(np.zeros((64, 64, 3), np.uint8))), "image/jpeg")
    assert _post(user_client, {"front": img}, consent="false").status_code == 422
    assert _post(user_client, {"front": img}, heightCm="20").status_code == 422
    r = _post(user_client, {"left-side": img})
    assert r.status_code == 422 and "front" in r.json()["error"]["fieldErrors"]
    assert _post(user_client, {"front": ("f.gif", io.BytesIO(b"GIF89a"), "image/gif")}).status_code == 415


needs_model = pytest.mark.skipif(not get_settings().pose_model_path.exists(), reason="pose model not downloaded")


@needs_model
def test_analyze_rejects_corrupt_image(user_client):
    r = _post(user_client, {"front": ("f.jpg", io.BytesIO(b"not really a jpeg"), "image/jpeg")})
    assert r.status_code == 422


@needs_model
def test_analyze_reports_missing_person_honestly(user_client):
    blank = _jpeg(np.full((960, 540, 3), 200, np.uint8))
    r = _post(user_client, {"front": ("f.jpg", io.BytesIO(blank), "image/jpeg"),
                            "left-side": ("s.jpg", io.BytesIO(blank), "image/jpeg")})
    assert r.status_code == 200, r.text
    data = r.json()["data"]
    assert data["views"]["front"]["used"] is False
    assert "No person" in data["views"]["front"]["issues"][0]
    assert data["views"]["back"]["provided"] is False
    assert data["measurements"]["height"]["value"] == 175
    assert all(v["value"] is None for k, v in data["measurements"].items() if k != "height")
    assert data["disclaimer"] and "bodym" in data["model"]


@needs_model
def test_analyze_adds_underbust_only_when_opted_in(user_client):
    blank = _jpeg(np.full((960, 540, 3), 200, np.uint8))
    files = lambda: {"front": ("f.jpg", io.BytesIO(blank), "image/jpeg")}
    plain = _post(user_client, files()).json()["data"]["measurements"]
    assert "underbust" not in plain
    opted = _post(user_client, files(), includeBust="true").json()["data"]["measurements"]
    assert opted["underbust"]["value"] is None and opted["underbust"]["reason"]

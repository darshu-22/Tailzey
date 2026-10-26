"""The committed 3D studio assets (public/models/mannequin, built by scripts/build_mannequin.py)."""

import json
from pathlib import Path

import numpy as np
import pytest

ASSETS = Path(__file__).resolve().parents[2] / "public" / "models" / "mannequin"
DTYPES = {"Int16": np.int16, "Uint16": np.uint16, "Uint32": np.uint32, "Float32": np.float32}

pytestmark = pytest.mark.skipif(not (ASSETS / "manifest.json").exists(), reason="mannequin assets not built")


def _manifest() -> dict:
    return json.loads((ASSETS / "manifest.json").read_text(encoding="utf-8"))


def _array(pack: dict, name: str) -> np.ndarray:
    entry = pack["arrays"][name]
    return np.frombuffer((ASSETS / pack["file"]).read_bytes(), DTYPES[entry["type"]], entry["length"], entry["offset"])


def test_every_file_is_present_and_complete():
    m = _manifest()
    packs = [*m["body"]["files"].values(), *m["garments"].values()]
    for pack in packs:
        assert (ASSETS / pack["file"]).stat().st_size == pack["bytes"]
    for g in m["garments"].values():
        assert g["mode"] == "clay" or (ASSETS / g["texture"]).exists()
        assert "normalMap" not in g or (ASSETS / g["normalMap"]).exists()


def test_indices_stay_inside_the_body():
    m = _manifest()
    body = m["body"]
    n, skin = body["vertexCount"], body["bodyVertexCount"]
    assert len(_array(body["files"]["common"], "position")) == n * 3
    quads = _array(body["files"]["common"], "quads")
    assert len(quads) % 4 == 0 and quads.max() < skin
    lm = body["landmarks"]
    assert max(max(v) for v in lm["joints"].values()) < n
    assert max([*lm["levels"].values(), *lm["shoulderTips"], lm["crotch"], lm["top"]]) < skin
    for g in m["garments"].values():
        assert _array(g, "refs").max() < n
        assert _array(g, "hide").max(initial=0) < skin
        assert _array(g, "index").max() < len(_array(g, "vertex"))
        assert all(a < n and b < n for a, b, _ in g["scale"].values())


def test_everything_is_cc0_and_credited():
    m = _manifest()
    assert "CC0" in m["credits"] and "MakeHuman" in m["credits"]
    assert all(g["credit"]["license"] == "CC0" for g in m["garments"].values())

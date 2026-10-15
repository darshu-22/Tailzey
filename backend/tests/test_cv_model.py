"""Trained measurement model + the views → measurements pipeline."""

import numpy as np
import pytest

from app.cv.geometry import ellipse_circumference
from app.cv.pipeline import estimate, to_response
from app.cv.quality import build_view
from app.cv.regressor import Forest, get_measurement_model
from app.services.catalog import measurement_ranges

from synthetic import HEIGHT_CM, front_body, side_body

MODEL = get_measurement_model()
needs_model = pytest.mark.skipif(MODEL is None, reason="measurement model not trained")
TARGETS = {"chest", "waist", "hip", "shoulderWidth", "armLength", "legLength"}


def test_forest_traversal():
    # Two stumps: x0 <= 1 -> -1 else +1 (NaN goes right); x1 <= 0 -> 10 else 20 (NaN goes left).
    f = Forest(
        roots=np.array([0, 3]), feature=np.array([0, 0, 0, 1, 0, 0]),
        threshold=np.array([1.0, 0, 0, 0.0, 0, 0]), left=np.array([1, 0, 0, 4, 0, 0]),
        right=np.array([2, 0, 0, 5, 0, 0]), missing_left=np.array([False, False, False, True, False, False]),
        is_leaf=np.array([False, True, True, False, True, True]),
        value=np.array([0, -1.0, 1.0, 0, 10.0, 20.0]), baseline=100.0,
    )
    X = np.array([[0.5, -1.0], [2.0, 1.0], [np.nan, np.nan]])
    assert f.predict(X).tolist() == [109.0, 121.0, 111.0]


@needs_model
def test_model_metadata_and_error_ordering():
    assert set(MODEL.targets) == TARGETS
    assert "BodyM" in MODEL.meta["trainedOn"]
    for t in TARGETS:
        full = MODEL.models[(t, "full")].mae
        front = MODEL.models[(t, "frontOnly")].mae
        assert 0 < full < 6 and 0 < front < 8
    # A side view must help the girths it can see.
    for t in ("chest", "waist", "hip"):
        assert MODEL.models[(t, "full")].mae < MODEL.models[(t, "frontOnly")].mae


def _views(*pairs):
    return {k: build_view(k, d, HEIGHT_CM) for k, d in pairs}


@needs_model
def test_pipeline_front_and_side():
    est, warnings = estimate(_views(("front", front_body()), ("left-side", side_body())), HEIGHT_CM, MODEL)
    assert est["height"].value == HEIGHT_CM
    for t in TARGETS:
        e = est[t]
        assert np.isfinite(e.value) and e.confidence == "high"
        assert e.uncertainty == pytest.approx(MODEL.models[(t, "full")].mae, abs=0.05)
    assert est["neck"].value == pytest.approx(ellipse_circumference(6, 5), abs=0.5)
    assert est["neck"].confidence == "low"
    assert warnings == []


@needs_model
def test_pipeline_front_only_uses_front_model_and_skips_neck():
    est, warnings = estimate(_views(("front", front_body())), HEIGHT_CM, MODEL)
    assert all(np.isfinite(est[t].value) and est[t].confidence == "medium" for t in TARGETS)
    assert est["neck"].value is None and "side view" in est["neck"].reason
    assert any("front photo only" in w for w in warnings)


@needs_model
def test_pipeline_arms_touching_lowers_confidence():
    est, warnings = estimate(_views(("front", front_body(arms_touching=True)), ("left-side", side_body())),
                             HEIGHT_CM, MODEL)
    assert est["chest"].confidence == "medium"
    assert any("arms" in w for w in warnings)


def test_no_front_view_returns_reasons_not_numbers():
    est, warnings = estimate({}, HEIGHT_CM, model=None)
    assert all(est[k].value is None and est[k].reason for k in est if k != "height")
    assert warnings


def test_response_shape_and_range_check():
    ranges = measurement_ranges()
    from app.cv.pipeline import Estimate
    ok = to_response("chest", Estimate(96.04, 2.6, "high", "m"), ranges)
    assert ok == {"value": 96.0, "uncertainty": 2.6, "confidence": "high", "source": "camera_estimate", "method": "m"}
    bad = to_response("chest", Estimate(400, 2.6, "high", "m"), ranges)
    assert bad["value"] is None and bad["source"] == "not_recorded" and "plausible" in bad["reason"]

"""Opt-in underbust from the side-view bust fold."""

import numpy as np
import pytest

from app.cv.bust import UNDERBUST_UNCERTAINTY_CM, estimate_underbust, fold_index
from app.cv.geometry import ellipse_circumference
from app.cv.pipeline import estimate
from app.cv.quality import build_view
from app.cv.regressor import get_measurement_model

from synthetic import HEIGHT_CM, front_body, side_body

MODEL = get_measurement_model()
# Fold at y=320: front width 200 px = 40 cm, side depth 120 px = 24 cm.
RIBCAGE = ellipse_circumference(20, 12)
WAIST = ellipse_circumference(16, 10)


def _views(bust: bool = True):
    return [build_view("front", front_body(), HEIGHT_CM)], [build_view("left-side", side_body(bust), HEIGHT_CM)]


def test_fold_index_finds_the_knee_of_the_curve():
    assert fold_index(np.array([28, 27, 25, 24, 24, 24, 24.0])) == 3
    assert fold_index(np.full(8, 24.0)) is None  # flat: no fold


def test_underbust_from_the_bust_fold():
    fronts, sides = _views()
    value, reason = estimate_underbust(fronts, sides, HEIGHT_CM, waist_cm=None)
    assert reason is None and value == pytest.approx(RIBCAGE, abs=1.0)


def test_underbust_scales_by_the_model_waist():
    fronts, sides = _views()
    value, _ = estimate_underbust(fronts, sides, HEIGHT_CM, waist_cm=WAIST * 1.05)
    assert value == pytest.approx(RIBCAGE * 1.05, abs=1.0)
    capped, _ = estimate_underbust(fronts, sides, HEIGHT_CM, waist_cm=WAIST * 2)
    assert capped == pytest.approx(RIBCAGE * 1.15, abs=1.0)


def test_no_fold_or_no_side_view_gives_a_reason():
    fronts, sides = _views(bust=False)
    assert estimate_underbust(fronts, sides, HEIGHT_CM, None)[0] is None
    value, reason = estimate_underbust(fronts, [], HEIGHT_CM, None)
    assert value is None and "side view" in reason


@pytest.mark.skipif(MODEL is None, reason="measurement model not trained")
def test_pipeline_only_measures_bust_when_opted_in():
    views = {"front": build_view("front", front_body(), HEIGHT_CM),
             "left-side": build_view("left-side", side_body(bust=True), HEIGHT_CM)}
    assert "underbust" not in estimate(views, HEIGHT_CM, MODEL)[0]
    est = estimate(views, HEIGHT_CM, MODEL, include_bust=True)[0]["underbust"]
    assert (est.value is None and est.reason) or (
        est.confidence == "low" and est.uncertainty == UNDERBUST_UNCERTAINTY_CM)

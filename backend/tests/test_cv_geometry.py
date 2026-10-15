"""Pure geometry, silhouette features and photo quality gates."""

import math

import numpy as np
import pytest

from app.cv.geometry import ellipse_circumference, run_at
from app.cv.pipeline import MIN_ARM_GAP_RATIO
from app.cv.quality import build_view
from app.cv.silhouette import LEVELS, arm_gap_ratio, arm_reach, crotch_height, prepare, span_profile

from synthetic import BOTTOM, HEIGHT_CM, TOP, front_body, side_body

SCALE = 0.2


def level_row(f: float) -> int:
    return round(TOP + f * (BOTTOM - TOP))


def test_ellipse_circumference():
    assert ellipse_circumference(10, 10) == pytest.approx(2 * math.pi * 10)
    assert ellipse_circumference(20, 10) == pytest.approx(96.8845, abs=1e-3)  # exact elliptic integral


def test_run_at_detects_arm_merge():
    row = np.array([0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1], bool)
    assert run_at(row, 5) == (4, 7, False)
    assert run_at(row, 0) is None
    assert run_at(np.ones(11, bool), 5, lo=2, hi=8) == (2, 8, True)


def test_silhouette_profiles_match_known_dimensions():
    front, side = prepare(front_body().mask), prepare(side_body().mask)
    assert (front.top, front.bottom) == (TOP, BOTTOM - 1)
    width, depth = span_profile(front, SCALE), span_profile(side, SCALE)
    for f, w_px, d_px in ((0.30, 200, 120), (0.40, 160, 100), (0.50, 190, 120)):
        i = int(np.argmin(np.abs(LEVELS - f)))
        assert level_row(f) in range(*{0.30: (230, 380), 0.40: (380, 450), 0.50: (450, 560)}[f])
        assert width[i] == pytest.approx(w_px * SCALE, abs=0.3)
        assert depth[i] == pytest.approx(d_px * SCALE, abs=0.3)
    assert crotch_height(front, SCALE) == pytest.approx((BOTTOM - 560) * SCALE, abs=0.5)


def test_arm_reach_and_gap_detection():
    reach = arm_reach(prepare(front_body().mask), SCALE)
    # Outer shoulder (row 0.19 → y=221, x=150) to the arm's lowest point (y=599, x=150);
    # the legs below the crotch must not be mistaken for arms.
    assert reach == pytest.approx((599 - 221) * SCALE, abs=0.5)
    assert arm_gap_ratio(prepare(front_body().mask)) == 1.0
    assert arm_gap_ratio(prepare(front_body(arms_touching=True).mask)) < MIN_ARM_GAP_RATIO


def test_view_quality_checks():
    cut = front_body()
    cut.mask[:5] = True  # silhouette touches the top edge
    assert "cut off" in build_view("front", cut, HEIGHT_CM)[0]
    assert "side profile" in build_view("left-side", front_body(), HEIGHT_CM)[0]
    assert "side-on" in build_view("front", side_body(), HEIGHT_CM)[0]
    assert "No person" in build_view("front", None, HEIGHT_CM)[0]


def test_posture_checks():
    bent = front_body()
    bent.landmarks[25, :2] = (180, 690)  # left knee pushed out -> bent leg
    assert any("knees" in i for i in build_view("front", bent, HEIGHT_CM))
    t_pose = front_body()
    t_pose.landmarks[[15, 16], 1] = 215  # wrists at shoulder height
    assert any("Lower your arms" in i for i in build_view("front", t_pose, HEIGHT_CM))
    wide = front_body()
    wide.landmarks[27, 0], wide.landmarks[28, 0] = 60, 540
    assert any("hip-width" in i for i in build_view("front", wide, HEIGHT_CM))

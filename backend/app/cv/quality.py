"""Per-photo quality gates. Every rejection carries a user-facing fix-it message."""

import numpy as np

from .detector import ViewDetection
from .geometry import vertical_extent
from .views import (
    ANK_L,
    ANK_R,
    FRONT_KEYS,
    HIP_L,
    HIP_R,
    KNEE_L,
    KNEE_R,
    SH_L,
    SH_R,
    WR_L,
    WR_R,
    ViewGeometry,
    ViewKind,
)

MIN_BODY_PX = 300


def build_view(key: str, det: ViewDetection | None, height_cm: float) -> ViewGeometry | list[str]:
    """Validate one detection and compute its scale. Returns a list of issues if unusable."""
    if det is None:
        return ["No person detected. Make sure your whole body is in frame and well lit."]
    kind: ViewKind = "front" if key in FRONT_KEYS else "side"
    h = det.mask.shape[0]
    extent = vertical_extent(det.mask)
    if extent is None:
        return ["Could not separate your body from the background."]
    top, bottom = extent
    if top <= 2 or bottom >= h - 3:
        return ["Head or feet are cut off. Step back so your whole body fits in the frame."]
    issues: list[str] = []
    if det.people > 1:
        issues.append("More than one person detected; only the most prominent was measured.")
    if bottom - top < MIN_BODY_PX:
        issues.append("You appear small in the frame; stand closer or use a higher resolution for better accuracy.")
    view = ViewGeometry(key, kind, det, top, bottom, height_cm / (bottom - top), issues)
    if not view.visible(SH_L, SH_R, HIP_L, HIP_R):
        return ["Shoulders and hips must be clearly visible."]

    # Shoulder span relative to height is large facing the camera (~0.2), small in profile (~0.05).
    span = abs(view.lm(SH_L)[0] - view.lm(SH_R)[0]) / view.px_height
    if kind == "front" and span < 0.09:
        return ["This looks like a side-on photo. Face the camera directly for this view."]
    if kind == "side" and span > 0.12:
        return ["This doesn't look like a side profile. Turn 90° so your side faces the camera."]
    return posture_issues(view) or view


def _angle(a: tuple[float, float], b: tuple[float, float], c: tuple[float, float]) -> float:
    """Angle ABC in degrees."""
    v1, v2 = np.subtract(a, b), np.subtract(c, b)
    cos = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-9)
    return float(np.degrees(np.arccos(np.clip(cos, -1.0, 1.0))))


def posture_issues(v: ViewGeometry) -> list[str]:
    """The method assumes an upright A-pose; reject photos where that clearly isn't true."""
    issues = []
    for hip, knee, ankle in ((HIP_L, KNEE_L, ANK_L), (HIP_R, KNEE_R, ANK_R)):
        if v.visible(hip, knee, ankle) and _angle(v.lm(hip), v.lm(knee), v.lm(ankle)) < 160:
            issues.append("Stand up straight with your knees unbent.")
            break
    if v.kind == "front":
        sh_y, hip_y = v.mid(SH_L, SH_R)[1], v.mid(HIP_L, HIP_R)[1]
        for wrist in (WR_L, WR_R):
            if v.visible(wrist) and v.lm(wrist)[1] < sh_y + 0.5 * (hip_y - sh_y):
                issues.append("Lower your arms so they hang about 15° away from your body (not raised).")
                break
        if v.visible(ANK_L, ANK_R) and abs(v.lm(ANK_L)[0] - v.lm(ANK_R)[0]) / v.px_height > 0.2:
            issues.append("Stand with your feet about hip-width apart.")
    return issues

"""Views → measurements.

1. Each usable photo is turned into a silhouette profile (widths/depths at 51 body levels,
   crotch height, arm reach) scaled by the user's height — see silhouette.py.
2. Front/back profiles are averaged, as are left/right side profiles.
3. The trained model (regressor.py; ridge + boosted trees on BodyM) predicts each
   measurement. With no side view a front-only model is used, with its own (larger) error.
4. Neck uses landmark geometry (no training data exists for it).
Every value carries ± = the model's measured error on held-out people.
"""

from dataclasses import dataclass

import numpy as np

from .neck import NECK_UNCERTAINTY_CM, estimate_neck
from .regressor import MeasurementModel
from .silhouette import arm_gap_ratio, feature_vector, front_features, prepare, side_features
from .views import FRONT_KEYS, SIDE_KEYS, ViewGeometry

MEASURED_KEYS = ("neck", "shoulderWidth", "chest", "waist", "hip", "armLength", "legLength")
# Typical error is widened when the capture is less than ideal.
CONFIDENCE_FACTOR = {"high": 1.0, "medium": 1.3, "low": 1.6}


@dataclass
class Estimate:
    value: float | None = None
    uncertainty: float | None = None
    confidence: str | None = None
    method: str | None = None
    reason: str | None = None


# Below this share of chest/waist rows with a visible arm gap, the arms touch the torso.
MIN_ARM_GAP_RATIO = 0.5


def _profiles(fronts: list[ViewGeometry], sides: list[ViewGeometry], height_cm: float):
    front_sils = [s for v in fronts if (s := prepare(v.det.mask))]
    front_feats = [front_features(s, height_cm) for s in front_sils]
    side_feats = [side_features(s, height_cm) for v in sides if (s := prepare(v.det.mask))]
    if not front_feats:
        return None, None
    with np.errstate(all="ignore"):
        front = {
            "width": np.nanmean([f["width"] for f in front_feats], axis=0),
            "crotch": float(np.nanmean([f["crotch"] for f in front_feats])),
            "reach": float(np.nanmean([f["reach"] for f in front_feats])),
            "armGap": float(np.mean([arm_gap_ratio(s) for s in front_sils])),
        }
        side = {"depth": np.nanmean([s["depth"] for s in side_feats], axis=0)} if side_feats else None
    return front, side


def _capture_confidence(fronts, sides, front) -> tuple[str, list[str]]:
    warnings = []
    level = "high"
    if not sides:
        level = "medium"
    if any(v.issues for v in fronts + sides):
        level = "medium"
    if front["armGap"] < MIN_ARM_GAP_RATIO:
        level = "low" if level == "medium" else "medium"
        warnings.append("Your arms seemed to touch your body. "
                        "Hold them slightly away from your sides for better accuracy.")
    if not np.isfinite(front["crotch"]):
        warnings.append("No gap between your legs was visible. Stand with feet hip-width apart for a better inseam.")
    return level, warnings


def estimate(
    views: dict[str, ViewGeometry], height_cm: float, model: MeasurementModel
) -> tuple[dict[str, Estimate], list[str]]:
    fronts = [v for k, v in views.items() if k in FRONT_KEYS]
    sides = [v for k, v in views.items() if k in SIDE_KEYS]
    out = {"height": Estimate(height_cm, method="entered by user")}
    front, side = _profiles(fronts, sides, height_cm)
    if front is None:
        out |= {k: Estimate(reason="A usable front or back photo is required.") for k in MEASURED_KEYS}
        return out, ["No usable front or back view, so no measurements could be estimated."]

    warnings = [] if sides else ["No usable side view: estimates use the front photo only and are less precise."]
    level, capture_warnings = _capture_confidence(fronts, sides, front)
    warnings += capture_warnings
    factor = CONFIDENCE_FACTOR[level]
    method = "silhouette model, front + side" if side else "silhouette model, front only"

    predictions = model.predict(feature_vector(height_cm, front, side), has_side=side is not None)
    for key, (value, mae) in predictions.items():
        out[key] = Estimate(value, round(mae * factor, 1), level, method)

    neck, reason = estimate_neck(fronts, sides)
    out["neck"] = (Estimate(neck, NECK_UNCERTAINTY_CM, "low", "landmark geometry (not yet validated)")
                   if neck is not None else Estimate(reason=reason))
    return out, warnings


def to_response(key: str, e: Estimate, ranges: dict[str, dict]) -> dict:
    """Shape one estimate for the API (MeasurementEstimate schema), with a plausibility check."""
    if key == "height":
        return {"value": round(e.value, 1), "uncertainty": None, "confidence": None,
                "source": "user_entered", "method": e.method}
    if e.value is None:
        return {"value": None, "uncertainty": None, "confidence": None, "source": "not_recorded", "reason": e.reason}
    lo, hi = ranges[key]["minCm"], ranges[key]["maxCm"]
    if not lo <= e.value <= hi:
        return {"value": None, "uncertainty": None, "confidence": None, "source": "not_recorded",
                "reason": "The estimate was outside a plausible range. Please retake the photos or measure manually."}
    return {"value": round(e.value, 1), "uncertainty": e.uncertainty, "confidence": e.confidence,
            "source": "camera_estimate", "method": e.method}

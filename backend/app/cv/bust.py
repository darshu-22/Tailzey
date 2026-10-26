"""Underbust (bra band) circumference from the side-view bust fold.

BodyM has no underbust ground truth, so like neck this is geometry, not the trained model:
1. Side views give a front-to-back depth profile down the torso (the flat back cancels out).
2. The bust apex is the deepest row of the upper chest.
3. The fold (inframammary crease) is the knee of the apex → ribcage curve: the row that lies
   furthest below the straight line from the apex to 16 cm lower. Apex depth minus fold depth
   is the bust projection.
4. Underbust = ellipse(front width, side depth) at the fold, scaled by how far the same
   ellipse misses the trained model's waist (ribcage and waist have similar cross-sections).
"""

from collections.abc import Callable, Iterable

import numpy as np

from .geometry import ellipse_circumference
from .views import HIP_L, HIP_R, SH_L, SH_R, ViewGeometry

# Not validated against tape measurements → reported with a wide band and low confidence.
UNDERBUST_UNCERTAINTY_CM = 4.0
STEP_CM = 0.5
FOLD_SEARCH_CM = 16.0
MIN_KNEE_CM = 0.3
MIN_PROJECTION_CM = 1.0
WAIST_SCALE_LIMITS = (0.9, 1.15)

NO_FOLD = ("No bust fold was visible in the side view. Wear a fitted, non-padded top, "
           "or measure your underbust with a tape.")


def _mean(values: Iterable[float | None]) -> float | None:
    vals = [v for v in values if v is not None]
    return float(np.mean(vals)) if vals else None


def _profile(views: list[ViewGeometry], fs: np.ndarray, probe: Callable) -> np.ndarray:
    """Mean of probe(view, f) over the views at each f (NaN where no view has a value)."""
    return np.array([_mean(probe(v, f) for v in views) for f in fs], dtype=float)


def _smooth(x: np.ndarray) -> np.ndarray:
    """1.5 cm moving average: single mask rows are noisy at the outline."""
    padded = np.pad(x, 1, mode="edge")
    return (padded[:-2] + padded[1:-1] + padded[2:]) / 3


def fold_index(depth: np.ndarray) -> int | None:
    """Knee of a falling depth curve: the sample furthest below the first→last chord."""
    gap = np.linspace(depth[0], depth[-1], len(depth)) - depth
    i = int(np.argmax(gap))
    return i if gap[i] >= MIN_KNEE_CM and 0 < i < len(depth) - 1 else None


def _waist_scale(fronts: list[ViewGeometry], sides: list[ViewGeometry], fs: np.ndarray,
                 waist_cm: float | None) -> float:
    """Model waist ÷ the narrowest geometric ellipse below the fold, within sane limits."""
    widths = _profile(fronts, fs, ViewGeometry.width_cm)
    depths = _profile(sides, fs, ViewGeometry.depth_cm)
    ellipses = [ellipse_circumference(w / 2, d / 2) for w, d in zip(widths, depths, strict=True)
                if np.isfinite(w) and np.isfinite(d)]
    if waist_cm is None or not ellipses:
        return 1.0
    return float(np.clip(waist_cm / min(ellipses), *WAIST_SCALE_LIMITS))


def estimate_underbust(fronts: list[ViewGeometry], sides: list[ViewGeometry], height_cm: float,
                       waist_cm: float | None) -> tuple[float | None, str | None]:
    """(circumference_cm, None) or (None, reason)."""
    if not sides:
        return None, "Underbust needs a side view (left or right) to find the bust fold."
    shoulder = float(np.mean([v.f_at(v.mid(SH_L, SH_R)[1]) for v in sides]))
    hip = float(np.mean([v.f_at(v.mid(HIP_L, HIP_R)[1]) for v in sides]))
    torso = hip - shoulder
    if torso <= 0:
        return None, "Could not locate your torso in the side view. Stand upright, side-on."

    step = STEP_CM / height_cm
    window = int(FOLD_SEARCH_CM / STEP_CM)
    upper = np.arange(shoulder + 0.15 * torso, shoulder + 0.5 * torso, step)
    fs = np.concatenate([upper, upper[-1] + step * np.arange(1, window + 1)])
    depth = _profile(sides, fs, ViewGeometry.depth_cm)
    if not np.isfinite(depth).all():
        return None, "Could not trace your side outline at chest level."
    depth = _smooth(depth)

    apex = int(np.argmax(depth[: len(upper)]))
    curve = depth[apex : apex + window + 1]
    fold = fold_index(curve)
    if fold is None or curve[0] - curve[fold] < MIN_PROJECTION_CM:
        return None, NO_FOLD
    f_fold = float(fs[apex + fold])
    width = _mean(v.width_cm(f_fold) for v in fronts)
    if width is None:
        return None, "Could not measure your ribcage width in the front photo."
    scale = _waist_scale(fronts, sides, np.arange(f_fold, hip, step), waist_cm)
    return ellipse_circumference(width / 2, float(curve[fold]) / 2) * scale, None

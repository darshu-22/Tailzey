"""Pure geometry helpers for silhouette-based body measurement (no ML dependencies)."""

import math
from collections.abc import Sequence
from itertools import pairwise

import cv2
import numpy as np


def ellipse_circumference(a: float, b: float) -> float:
    """Ramanujan's second approximation for an ellipse with semi-axes a, b."""
    if a <= 0 or b <= 0:
        raise ValueError("semi-axes must be positive")
    h = ((a - b) / (a + b)) ** 2
    return math.pi * (a + b) * (1 + 3 * h / (10 + math.sqrt(4 - 3 * h)))


def largest_component(mask: np.ndarray) -> np.ndarray:
    """Keep only the largest 8-connected blob (drops background noise / other objects)."""
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8), connectivity=8)
    if n <= 1:
        return np.zeros(mask.shape, dtype=bool)
    idx = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    return labels == idx


def vertical_extent(mask: np.ndarray) -> tuple[int, int] | None:
    rows = np.flatnonzero(mask.any(axis=1))
    return (int(rows[0]), int(rows[-1])) if rows.size else None


def run_at(
    row: np.ndarray, cx: float, lo: float | None = None, hi: float | None = None
) -> tuple[int, int, bool] | None:
    """Contiguous run of True pixels in `row` that contains column `cx`.

    The run is bounded to [lo, hi] when given (used to stop at the arm centre-lines).
    Returns (left, right, clipped) where `clipped` means the run was still solid when it
    hit a bound, i.e. the torso is merged with an arm and the width is over-estimated.
    """
    w = row.shape[0]
    c = int(round(cx))
    lo_i = 0 if lo is None else max(0, math.ceil(lo))
    hi_i = w - 1 if hi is None else min(w - 1, math.floor(hi))
    if not (lo_i <= c <= hi_i) or not row[c]:
        return None
    gaps_l = np.flatnonzero(~row[lo_i : c + 1])
    gaps_r = np.flatnonzero(~row[c : hi_i + 1])
    left = lo_i + int(gaps_l[-1]) + 1 if gaps_l.size else lo_i
    right = c + int(gaps_r[0]) - 1 if gaps_r.size else hi_i
    clipped = (not gaps_l.size and lo is not None and lo_i > 0) or (
        not gaps_r.size and hi is not None and hi_i < w - 1
    )
    return left, right, bool(clipped)


def polyline_x_at_y(points: Sequence[tuple[float, float]], y: float) -> float | None:
    """x where a (mostly downward) polyline crosses height y, or None if it doesn't."""
    for (x0, y0), (x1, y1) in pairwise(points):
        if min(y0, y1) <= y <= max(y0, y1):
            if y1 == y0:
                return (x0 + x1) / 2
            t = (y - y0) / (y1 - y0)
            return x0 + t * (x1 - x0)
    return None


def polyline_length(points: Sequence[tuple[float, float]]) -> float:
    return float(sum(math.dist(p, q) for p, q in pairwise(points)))

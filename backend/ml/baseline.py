"""Untrained geometry baseline: read measurements straight off the silhouette profiles.

Kept only for the accuracy report, to show what learning adds over raw geometry.
"""

import numpy as np

from app.cv.silhouette import LEVELS


def _band(lo: float, hi: float) -> np.ndarray:
    return (LEVELS >= lo - 1e-9) & (LEVELS <= hi + 1e-9)


def geometric_baseline(X: np.ndarray) -> dict[str, np.ndarray]:
    n = len(LEVELS)
    width, circ = X[:, 3:3 + n], X[:, 3 + 2 * n:3 + 3 * n]
    with np.errstate(all="ignore"):
        return {
            "chest": np.nanmax(circ[:, _band(0.24, 0.32)], axis=1),
            "waist": np.nanmin(circ[:, _band(0.34, 0.45)], axis=1),
            "hip": np.nanmax(circ[:, _band(0.46, 0.56)], axis=1),
            "shoulderWidth": width[:, int(np.argmin(np.abs(LEVELS - 0.19)))],
            "armLength": X[:, 2],
            "legLength": X[:, 1],
        }

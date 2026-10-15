"""Silhouette feature extraction shared by training (BodyM masks) and inference
(MediaPipe person masks). Works from the binary mask alone, so training and
production see identical features.

All lengths are returned in centimetres using the known body height for scale.
"""

from dataclasses import dataclass

import cv2
import numpy as np

from .geometry import ellipse_circumference, largest_component, run_at, vertical_extent

# Body levels as fractions of height measured from the top of the head.
LEVELS = np.round(np.arange(0.10, 0.6001, 0.01), 2)
SHOULDER_LEVEL = 0.19  # acromion sits ~18% of stature below the vertex
_CLOSE_KERNEL = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))


@dataclass(frozen=True)
class Silhouette:
    mask: np.ndarray  # cleaned bool mask
    top: int
    bottom: int
    center_x: float

    @property
    def height_px(self) -> int:
        return self.bottom - self.top

    def row(self, f: float) -> int:
        return int(round(self.top + f * self.height_px))


def prepare(mask: np.ndarray) -> Silhouette | None:
    """Keep the main body blob, close pin-holes, find vertical extent and torso centre."""
    m = largest_component(mask)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, _CLOSE_KERNEL).astype(bool)
    extent = vertical_extent(m)
    if extent is None or extent[1] - extent[0] < 50:
        return None
    top, bottom = extent
    h = bottom - top
    rows = m[top + int(0.25 * h): top + int(0.45 * h)]
    mids = [(c[0] + c[-1]) / 2 for r in rows if (c := np.flatnonzero(r)).size]
    if not mids:
        return None
    return Silhouette(m, top, bottom, float(np.median(mids)))


def _center_run(sil: Silhouette, y: int) -> tuple[int, int] | None:
    """Run of the row that contains (or is nearest to) the torso centre line."""
    if not 0 <= y < sil.mask.shape[0]:
        return None
    row = sil.mask[y]
    run = run_at(row, sil.center_x)
    if run is None:
        cols = np.flatnonzero(row)
        if not cols.size:
            return None
        nearest = cols[np.argmin(np.abs(cols - sil.center_x))]
        if abs(nearest - sil.center_x) > 0.08 * sil.height_px:
            return None
        run = run_at(row, nearest)
    return run[0], run[1]


def span_profile(sil: Silhouette, scale: float) -> np.ndarray:
    """Width (front) or depth (side) of the central body run at every LEVEL, in cm (NaN if absent)."""
    out = np.full(len(LEVELS), np.nan)
    for i, f in enumerate(LEVELS):
        run = _center_run(sil, sil.row(f))
        if run is not None:
            out[i] = (run[1] - run[0] + 1) * scale
    return out


def crotch_height(sil: Silhouette, scale: float) -> float:
    """Floor-to-crotch height: top of the gap between the legs on the centre line."""
    x = int(round(sil.center_x))
    start = sil.row(0.40)
    col = sil.mask[start: sil.bottom, x]
    gap = np.flatnonzero(~col)
    if not gap.size:
        return np.nan
    return (sil.bottom - (start + gap[0])) * scale


def _runs(row: np.ndarray) -> list[tuple[int, int]]:
    d = np.diff(np.concatenate([[0], row.astype(np.int8), [0]]))
    return list(zip(np.flatnonzero(d == 1), np.flatnonzero(d == -1) - 1, strict=True))


def _trace_arm(sil: Silhouette, side: int) -> tuple[int, int] | None:
    """Follow one arm (side -1 = image-left, +1 = image-right) from where it separates from
    the torso down to its lowest point. Tracking by overlap keeps legs from being mistaken
    for arms; tracking stops if the hand merges into the body."""
    prev, tip = None, None
    for y in range(sil.row(0.25), sil.row(0.80)):
        runs = _runs(sil.mask[y])
        if prev is None:
            torso = _center_run(sil, y)
            outer = [r for r in runs if torso and (r[1] < torso[0] if side < 0 else r[0] > torso[1])]
            if not outer:
                continue
            cand = min(outer) if side < 0 else max(outer)
        else:
            touching = [r for r in runs if r[0] <= prev[1] and r[1] >= prev[0]]
            if not touching:
                break
            cand = min(touching) if side < 0 else max(touching)
            if cand[1] - cand[0] > 3 * (prev[1] - prev[0]) + 10:
                break  # merged into the body
        prev = cand
        tip = (y, cand[0] if side < 0 else cand[1])
    return tip


def arm_reach(sil: Silhouette, scale: float) -> float:
    """Mean straight-line distance from each outer shoulder point to that arm's lowest point
    (A-pose); NaN if neither arm can be separated from the body."""
    y_sh = sil.row(SHOULDER_LEVEL)
    shoulder = _center_run(sil, y_sh)
    if shoulder is None:
        return np.nan
    reaches = []
    for side, x_sh in ((-1, shoulder[0]), (1, shoulder[1])):
        tip = _trace_arm(sil, side)
        if tip is not None:
            reaches.append(np.hypot(tip[0] - y_sh, tip[1] - x_sh) * scale)
    return float(np.mean(reaches)) if reaches else np.nan


def arm_gap_ratio(sil: Silhouette) -> float:
    """Share of chest/waist rows where both arms are visibly separated from the torso.

    Low values mean the arms rest against the body, which inflates torso widths.
    """
    rows = range(sil.row(0.27), sil.row(0.40))
    separated = 0
    for y in rows:
        torso = _center_run(sil, y)
        cols = np.flatnonzero(sil.mask[y])
        if torso is not None and (cols < torso[0]).any() and (cols > torso[1]).any():
            separated += 1
    return separated / max(len(rows), 1)


def front_features(sil: Silhouette, height_cm: float) -> dict[str, np.ndarray | float]:
    scale = height_cm / sil.height_px
    return {
        "width": span_profile(sil, scale),
        "crotch": crotch_height(sil, scale),
        "reach": arm_reach(sil, scale),
    }


def side_features(sil: Silhouette, height_cm: float) -> dict[str, np.ndarray]:
    return {"depth": span_profile(sil, height_cm / sil.height_px)}


def ellipse_profile(width: np.ndarray, depth: np.ndarray) -> np.ndarray:
    out = np.full(len(width), np.nan)
    ok = np.isfinite(width) & np.isfinite(depth) & (width > 0) & (depth > 0)
    for i in np.flatnonzero(ok):
        out[i] = ellipse_circumference(width[i] / 2, depth[i] / 2)
    return out


def feature_vector(height_cm: float, front: dict, side: dict | None) -> np.ndarray:
    """Model input. Front-only models simply ignore the side block (all NaN)."""
    width = front["width"]
    depth = side["depth"] if side is not None else np.full(len(LEVELS), np.nan)
    return np.concatenate([
        [height_cm, front["crotch"], front["reach"]],
        width,
        depth,
        ellipse_profile(width, depth),
    ])


def feature_names() -> list[str]:
    lv = [f"{f:.2f}" for f in LEVELS]
    return (["height", "crotch", "reach"] + [f"w{x}" for x in lv]
            + [f"d{x}" for x in lv] + [f"c{x}" for x in lv])

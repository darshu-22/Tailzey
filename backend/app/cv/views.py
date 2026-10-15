"""A detected photo view with its pixel→cm scale and landmark-based probes."""

from dataclasses import dataclass, field
from typing import Literal

import numpy as np

from .detector import ViewDetection
from .geometry import polyline_x_at_y, run_at

# MediaPipe pose landmark indices
NOSE, MOUTH_L, MOUTH_R = 0, 9, 10
SH_L, SH_R, EL_L, EL_R, WR_L, WR_R, IDX_L, IDX_R = 11, 12, 13, 14, 15, 16, 19, 20
HIP_L, HIP_R, KNEE_L, KNEE_R, ANK_L, ANK_R = 23, 24, 25, 26, 27, 28
VIS_MIN = 0.5

FRONT_KEYS = ("front", "back")
SIDE_KEYS = ("left-side", "right-side")
VIEW_KEYS = FRONT_KEYS + SIDE_KEYS
ViewKind = Literal["front", "side"]


@dataclass
class ViewGeometry:
    key: str
    kind: ViewKind
    det: ViewDetection
    top: int
    bottom: int
    scale: float  # cm per pixel
    issues: list[str] = field(default_factory=list)

    @property
    def px_height(self) -> int:
        return self.bottom - self.top

    def y_at(self, f: float) -> float:
        return self.top + f * self.px_height

    def f_at(self, y: float) -> float:
        return (y - self.top) / self.px_height

    def lm(self, i: int) -> tuple[float, float]:
        return float(self.det.landmarks[i, 0]), float(self.det.landmarks[i, 1])

    def visible(self, *idx: int) -> bool:
        return bool(np.all(self.det.landmarks[list(idx), 3] >= VIS_MIN))

    def mid(self, a: int, b: int) -> tuple[float, float]:
        (x0, y0), (x1, y1) = self.lm(a), self.lm(b)
        return (x0 + x1) / 2, (y0 + y1) / 2

    def center_x(self, y: float) -> float:
        """Body centre line, interpolated between shoulder-mid and hip-mid."""
        (sx, sy), (hx, hy) = self.mid(SH_L, SH_R), self.mid(HIP_L, HIP_R)
        if hy == sy:
            return (sx + hx) / 2
        t = min(max((y - sy) / (hy - sy), -0.5), 1.5)
        return sx + t * (hx - sx)

    def _arm_bounds(self, y: float) -> tuple[float | None, float | None]:
        arms = ([self.lm(i) for i in (SH_L, EL_L, WR_L, IDX_L)], [self.lm(i) for i in (SH_R, EL_R, WR_R, IDX_R)])
        xs = [polyline_x_at_y(a, y) for a in arms]
        cx = self.center_x(y)
        left = [x for x in xs if x is not None and x < cx]
        right = [x for x in xs if x is not None and x > cx]
        return (max(left) if left else None, min(right) if right else None)

    def width_cm(self, f: float) -> float | None:
        """Front/back body width at height fraction f, bounded by the arm centre-lines."""
        y = self.y_at(f)
        yi = int(round(y))
        if not 0 <= yi < self.det.mask.shape[0]:
            return None
        run = run_at(self.det.mask[yi], self.center_x(y), *self._arm_bounds(y))
        return None if run is None else (run[1] - run[0] + 1) * self.scale

    def depth_cm(self, f: float) -> float | None:
        """Side-view body depth at height fraction f."""
        yi = int(round(self.y_at(f)))
        if not 0 <= yi < self.det.mask.shape[0]:
            return None
        run = run_at(self.det.mask[yi], self.center_x(yi))
        return None if run is None else (run[1] - run[0] + 1) * self.scale

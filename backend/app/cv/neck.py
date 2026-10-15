"""Neck circumference from landmark-guided geometry.

BodyM has no neck ground truth, so neck can't use the trained model. It is the narrowest
front-width × side-depth ellipse between the mouth and the shoulder line.
"""

import numpy as np

from .geometry import ellipse_circumference
from .views import MOUTH_L, MOUTH_R, SH_L, SH_R, ViewGeometry

# Not validated against tape measurements → reported with a wide band and low confidence.
NECK_UNCERTAINTY_CM = 3.0


def estimate_neck(fronts: list[ViewGeometry], sides: list[ViewGeometry]) -> tuple[float | None, str | None]:
    """(circumference_cm, None) or (None, reason)."""
    if not sides:
        return None, "Neck needs a side view (left or right) to measure depth."
    sh_f = float(np.mean([v.f_at(v.mid(SH_L, SH_R)[1]) for v in fronts]))
    mouth_f = float(np.mean([v.f_at(v.mid(MOUTH_L, MOUTH_R)[1]) for v in fronts]))
    gap = sh_f - mouth_f
    if gap <= 0:
        return None, "Could not locate the neck. Keep your head upright and facing forward."
    best = None
    for f in np.linspace(mouth_f + 0.35 * gap, sh_f - 0.05 * gap, 24):
        widths = [w for v in fronts if (w := v.width_cm(f)) is not None]
        depths = [d for v in sides if (d := v.depth_cm(f)) is not None]
        if widths and depths:
            c = ellipse_circumference(np.mean(widths) / 2, np.mean(depths) / 2)
            best = c if best is None else min(best, c)
    return (best, None) if best is not None else (None, "Could not find the neck outline in the photos.")

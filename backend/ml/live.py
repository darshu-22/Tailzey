"""Run BodyM people through the *live* pipeline and collect errors vs ground truth.

Silhouettes are rendered as plain images and go through exactly what the API runs:
MediaPipe detection → quality gates → features from the MediaPipe mask → trained model.
Rendered silhouettes are not camera photos (no clothing/lighting/background), so this
measures the training-mask → production-mask gap, not full real-world accuracy.
"""

import csv
from pathlib import Path

import cv2
import numpy as np

from app.core.config import get_settings
from app.cv.detector import PoseDetector
from app.cv.pipeline import estimate
from app.cv.quality import build_view
from app.cv.regressor import MeasurementModel
from app.cv.views import ViewGeometry

from .dataset import DATA_DIR, TARGETS

BODY = np.array([90, 120, 160], np.uint8)
BACKGROUND = np.array([235, 235, 235], np.uint8)
VARIANT_VIEWS = {"full": ("front", "left-side"), "frontOnly": ("front",)}


def _render(mask_path: Path) -> bytes:
    m = cv2.imread(str(mask_path), cv2.IMREAD_GRAYSCALE)
    return cv2.imencode(".jpg", np.where(m[..., None] > 127, BODY, BACKGROUND))[1].tobytes()


def _rows(path: Path) -> list[dict[str, str]]:
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def live_errors(split: str, n: int, model: MeasurementModel) -> tuple[dict, int]:
    """{variant: {target: np.ndarray of (estimate - truth)}}, number of usable photo pairs."""
    root = DATA_DIR / split
    hwg = {r["subject_id"]: r for r in _rows(root / "hwg_metadata.csv")}
    truth = {r["subject_id"]: r for r in _rows(root / "measurements.csv")}
    photos = _rows(root / "subject_to_photo_map.csv")[:n]
    errors = {v: {key: [] for key in TARGETS.values()} for v in VARIANT_VIEWS}
    used = 0
    detector = PoseDetector(get_settings().pose_model_path, max_workers=4)
    try:
        for row in photos:
            sid, pid = row["subject_id"], row["photo_id"]
            height = float(hwg[sid]["height_cm"])
            front = detector.submit(_render(root / "mask" / f"{pid}.png"), 1280)
            side = detector.submit(_render(root / "mask_left" / f"{pid}.png"), 1280)
            views = {k: build_view(k, f.result(), height) for k, f in (("front", front), ("left-side", side))}
            views = {k: v for k, v in views.items() if isinstance(v, ViewGeometry)}
            if set(views) != {"front", "left-side"}:
                continue
            used += 1
            for variant, keys in VARIANT_VIEWS.items():
                est, _ = estimate({k: views[k] for k in keys}, height, model)
                for col, key in TARGETS.items():
                    if est[key].value is not None:
                        errors[variant][key].append(est[key].value - float(truth[sid][col]))
    finally:
        detector.close()
    return {v: {k: np.array(e) for k, e in errs.items()} for v, errs in errors.items()}, used

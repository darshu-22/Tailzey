"""Download the MediaPipe pose model(s) used by the measurement pipeline.

Usage (from backend/):
    .venv/Scripts/python scripts/download_models.py            # heavy (default)
    .venv/Scripts/python scripts/download_models.py full lite  # others
"""

import sys
import urllib.request
from pathlib import Path

BASE = "https://storage.googleapis.com/mediapipe-models/pose_landmarker"
MODELS = {
    "heavy": f"{BASE}/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task",
    "full": f"{BASE}/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
    "lite": f"{BASE}/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
}
MODELS_DIR = Path(__file__).resolve().parent.parent / "models"


def download(variant: str) -> Path:
    target = MODELS_DIR / f"pose_landmarker_{variant}.task"
    if target.exists() and target.stat().st_size > 0:
        print(f"{target.name} already present")
        return target
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(".part")
    print(f"Downloading {variant} model ...")
    urllib.request.urlretrieve(MODELS[variant], tmp)
    tmp.replace(target)
    print(f"Saved {target} ({target.stat().st_size / 1e6:.1f} MB)")
    return target


if __name__ == "__main__":
    variants = sys.argv[1:] or ["heavy"]
    unknown = [v for v in variants if v not in MODELS]
    if unknown:
        sys.exit(f"Unknown model(s): {unknown}. Choose from {sorted(MODELS)}")
    for v in variants:
        download(v)

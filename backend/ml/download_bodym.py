"""Download the BodyM dataset (silhouettes + measurements) for training/evaluation.

BodyM — Ruiz et al., "Human Body Measurement Estimation with Adversarial Augmentation"
(3DV 2022). Registry: https://registry.opendata.aws/bodym/ — license CC BY 4.0.

Usage (from backend/):  .venv/Scripts/python -m ml.download_bodym [train testA testB]
Files land in backend/ml/data/bodym/<split>/ (git-ignored). Re-runs skip existing files.
"""

import csv
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

BUCKET = "https://amazon-bodym.s3.amazonaws.com"
DATA_DIR = Path(__file__).resolve().parent / "data" / "bodym"
TABLES = ("hwg_metadata.csv", "measurements.csv", "subject_to_photo_map.csv")


def _fetch(url: str, target: Path) -> bool:
    if target.exists() and target.stat().st_size > 0:
        return False
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(target.suffix + ".part")
    urllib.request.urlretrieve(url, tmp)
    tmp.replace(target)
    return True


def download_split(split: str, workers: int = 32) -> None:
    root = DATA_DIR / split
    for name in TABLES:
        _fetch(f"{BUCKET}/{split}/{name}", root / name)
    with open(root / "subject_to_photo_map.csv", newline="") as f:
        photos = [row["photo_id"] for row in csv.DictReader(f)]
    jobs = [
        (f"{BUCKET}/{split}/{folder}/{pid}.png", root / folder / f"{pid}.png")
        for pid in photos
        for folder in ("mask", "mask_left")
    ]
    with ThreadPoolExecutor(workers) as pool:
        fetched = sum(pool.map(lambda j: _fetch(*j), jobs))
    print(f"{split}: {len(photos)} photos, {fetched} new files")


if __name__ == "__main__":
    for split in sys.argv[1:] or ["train", "testA", "testB"]:
        download_split(split)

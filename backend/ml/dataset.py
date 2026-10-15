"""Load a BodyM split into feature matrices + ground-truth targets (cached as .npz)."""

import csv
from concurrent.futures import ProcessPoolExecutor
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np

from app.cv.silhouette import feature_vector, front_features, prepare, side_features

DATA_DIR = Path(__file__).resolve().parent / "data" / "bodym"
CACHE_DIR = Path(__file__).resolve().parent / "data" / "cache"

# BodyM column -> Tailzey measurement key
TARGETS = {
    "chest": "chest",
    "waist": "waist",
    "hip": "hip",
    "shoulder-breadth": "shoulderWidth",
    "arm-length": "armLength",
    "leg-length": "legLength",
}


@dataclass
class Split:
    full: np.ndarray  # front + side features
    front_only: np.ndarray  # same layout, side block NaN
    y: dict[str, np.ndarray]  # Tailzey key -> target cm
    groups: np.ndarray  # subject ids (photos of one person must stay in one fold)
    gender: np.ndarray


def _read_csv(path: Path) -> list[dict[str, str]]:
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def _touches_edge(mask: np.ndarray, top: int, bottom: int) -> bool:
    return top <= 1 or bottom >= mask.shape[0] - 2


def _photo_features(args: tuple[Path, str, float]) -> tuple[np.ndarray, np.ndarray] | None:
    root, photo_id, height = args
    raw_f = cv2.imread(str(root / "mask" / f"{photo_id}.png"), cv2.IMREAD_GRAYSCALE)
    raw_s = cv2.imread(str(root / "mask_left" / f"{photo_id}.png"), cv2.IMREAD_GRAYSCALE)
    if raw_f is None or raw_s is None:
        return None
    front, side = prepare(raw_f > 127), prepare(raw_s > 127)
    # Same rule as production: the whole body must be in frame for height scaling.
    if front is None or side is None or _touches_edge(front.mask, front.top, front.bottom) \
            or _touches_edge(side.mask, side.top, side.bottom):
        return None
    ff = front_features(front, height)
    return feature_vector(height, ff, side_features(side, height)), feature_vector(height, ff, None)


def load_split(split: str, workers: int = 8) -> Split:
    cache = CACHE_DIR / f"{split}.npz"
    if cache.exists():
        z = np.load(cache, allow_pickle=False)
        y = {k: z[f"y_{k}"] for k in TARGETS.values()}
        return Split(z["full"], z["front_only"], y, z["groups"], z["gender"])

    root = DATA_DIR / split
    hwg = {r["subject_id"]: r for r in _read_csv(root / "hwg_metadata.csv")}
    meas = {r["subject_id"]: r for r in _read_csv(root / "measurements.csv")}
    pairs = [(r["subject_id"], r["photo_id"]) for r in _read_csv(root / "subject_to_photo_map.csv")
             if r["subject_id"] in hwg and r["subject_id"] in meas]
    jobs = [(root, pid, float(hwg[sid]["height_cm"])) for sid, pid in pairs]
    with ProcessPoolExecutor(workers) as pool:
        feats = list(pool.map(_photo_features, jobs, chunksize=32))

    keep = [i for i, f in enumerate(feats) if f is not None]
    full = np.stack([feats[i][0] for i in keep])
    front_only = np.stack([feats[i][1] for i in keep])
    sids = [pairs[i][0] for i in keep]
    y = {key: np.array([float(meas[s][col]) for s in sids]) for col, key in TARGETS.items()}
    groups = np.array(sids)
    gender = np.array([hwg[s]["gender"] for s in sids])

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(cache, full=full, front_only=front_only, groups=groups, gender=gender,
                        **{f"y_{k}": v for k, v in y.items()})
    print(f"{split}: {len(keep)}/{len(pairs)} photo pairs usable")
    return Split(full, front_only, y, groups, gender)

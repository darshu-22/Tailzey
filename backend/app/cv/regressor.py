"""Runtime measurement model: blend of ridge regression and gradient-boosted trees.

Trained offline by `python -m ml.train` on BodyM and stored as plain numpy arrays
(models/measurement_model.npz, loaded with allow_pickle=False) plus a JSON metadata
file holding held-out accuracy. Inference is pure numpy — no ML library at runtime.
"""

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import numpy as np

MODELS_DIR = Path(__file__).resolve().parent / "models"
WEIGHTS_PATH = MODELS_DIR / "measurement_model.npz"
META_PATH = MODELS_DIR / "measurement_model.json"
VARIANTS = ("full", "frontOnly")


@dataclass(frozen=True)
class Forest:
    """All trees of one boosted model packed into flat node arrays."""

    roots: np.ndarray  # (n_trees,) node index of each tree's root
    feature: np.ndarray
    threshold: np.ndarray
    left: np.ndarray
    right: np.ndarray
    missing_left: np.ndarray
    is_leaf: np.ndarray
    value: np.ndarray
    baseline: float

    def predict(self, X: np.ndarray) -> np.ndarray:
        node = np.broadcast_to(self.roots, (len(X), len(self.roots))).copy()
        rows = np.arange(len(X))[:, None]
        while True:
            active = ~self.is_leaf[node]
            if not active.any():
                break
            x = X[rows, self.feature[node]]
            go_left = np.where(np.isnan(x), self.missing_left[node], x <= self.threshold[node])
            nxt = np.where(go_left, self.left[node], self.right[node])
            node = np.where(active, nxt, node)
        return self.value[node].sum(axis=1) + self.baseline


@dataclass(frozen=True)
class Ridge:
    medians: np.ndarray
    mean: np.ndarray
    std: np.ndarray
    coef: np.ndarray
    intercept: float

    def predict(self, X: np.ndarray) -> np.ndarray:
        X = np.where(np.isfinite(X), X, self.medians)
        return ((X - self.mean) / self.std) @ self.coef + self.intercept


@dataclass(frozen=True)
class BlendModel:
    columns: np.ndarray  # feature columns this variant uses
    ridge: Ridge
    forest: Forest
    ridge_weight: float
    mae: float  # held-out mean absolute error (cm)

    def predict(self, features: np.ndarray) -> float:
        X = features[None, self.columns]
        w = self.ridge_weight
        return float(w * self.ridge.predict(X)[0] + (1 - w) * self.forest.predict(X)[0])


FOREST_FIELDS = ("roots", "feature", "threshold", "left", "right", "missing_left", "is_leaf", "value")
RIDGE_FIELDS = ("medians", "mean", "std", "coef")


def _prefix(target: str, variant: str) -> str:
    return f"{target}.{variant}"


def pack(target: str, variant: str, model: BlendModel) -> dict[str, np.ndarray]:
    """Arrays to store in the .npz (used by training)."""
    p = _prefix(target, variant)
    out = {f"{p}.columns": model.columns, f"{p}.scalars": np.array(
        [model.ridge.intercept, model.forest.baseline, model.ridge_weight, model.mae])}
    out |= {f"{p}.ridge.{f}": getattr(model.ridge, f) for f in RIDGE_FIELDS}
    out |= {f"{p}.forest.{f}": getattr(model.forest, f) for f in FOREST_FIELDS}
    return out


def unpack(arrays, target: str, variant: str) -> BlendModel:
    p = _prefix(target, variant)
    intercept, baseline, weight, mae = arrays[f"{p}.scalars"]
    ridge = Ridge(*(arrays[f"{p}.ridge.{f}"] for f in RIDGE_FIELDS), float(intercept))
    forest = Forest(*(arrays[f"{p}.forest.{f}"] for f in FOREST_FIELDS), float(baseline))
    return BlendModel(arrays[f"{p}.columns"], ridge, forest, float(weight), float(mae))


class MeasurementModel:
    def __init__(self, weights_path: Path = WEIGHTS_PATH, meta_path: Path = META_PATH):
        self.meta = json.loads(meta_path.read_text(encoding="utf-8"))
        with np.load(weights_path, allow_pickle=False) as arrays:
            self.models = {
                (t, v): unpack(arrays, t, v) for t in self.meta["targets"] for v in VARIANTS
            }

    @property
    def version(self) -> str:
        return self.meta["version"]

    @property
    def targets(self) -> list[str]:
        return list(self.meta["targets"])

    def predict(self, features: np.ndarray, has_side: bool) -> dict[str, tuple[float, float]]:
        """{target: (value_cm, typical_error_cm)}.

        `liveCalibration` (from ml.calibrate_live) removes the systematic gap between the
        training masks and live MediaPipe masks, and supplies the end-to-end held-out error
        of the live pipeline, which is reported instead of the mask-only model error.
        """
        variant = "full" if has_side else "frontOnly"
        live = self.meta.get("liveCalibration", {})
        offsets = live.get("offsets", {}).get(variant, {})
        live_mae = live.get("mae", {}).get(variant, {})
        return {
            t: (m.predict(features) - offsets.get(t, 0.0), live_mae.get(t, m.mae))
            for (t, v), m in self.models.items() if v == variant
        }


@lru_cache
def get_measurement_model() -> MeasurementModel | None:
    if not (WEIGHTS_PATH.exists() and META_PATH.exists()):
        return None
    return MeasurementModel()

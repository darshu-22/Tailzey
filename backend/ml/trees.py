"""Gradient-boosted trees trained with XGBoost on the GPU (training only), exported to
numpy Forest arrays so production needs no ML library.

Hyper-parameters are tuned by grouped cross-validation (people never span folds) with
early stopping. Training is GPU-only: it refuses to run without a CUDA device.
"""

import json
from functools import lru_cache

import numpy as np
import xgboost as xgb

from app.cv.regressor import Forest

SEARCH = [{"max_depth": d, "learning_rate": 0.08, "min_child_weight": mcw} for d in (3, 4, 6) for mcw in (5, 20)]
BASE = {"objective": "reg:absoluteerror", "tree_method": "hist", "subsample": 0.8,
        "colsample_bytree": 0.6, "reg_lambda": 1.0, "eval_metric": "mae"}
MAX_ROUNDS = 3000


@lru_cache
def device() -> str:
    """Return "cuda", or stop: tree training must run on the GPU."""
    if not xgb.build_info().get("USE_CUDA"):
        raise RuntimeError("This XGBoost build has no CUDA support; install the CUDA-enabled wheel.")
    try:
        xgb.train({"device": "cuda", "tree_method": "hist"}, xgb.DMatrix(np.zeros((2, 1)), label=[0, 1]), 1)
    except xgb.core.XGBoostError as exc:
        raise RuntimeError(f"No usable CUDA GPU for training: {exc}") from exc
    return "cuda"


def tune(X: np.ndarray, y: np.ndarray, folds: list[np.ndarray]) -> dict:
    """Best params (incl. number of rounds) by grouped-CV MAE with early stopping."""
    dtrain = xgb.DMatrix(X, label=y, missing=np.nan)
    all_idx = np.arange(len(y))
    cv_folds = [(np.setdiff1d(all_idx, val), val) for val in folds]
    best = None
    for params in SEARCH:
        p = {**BASE, **params, "device": device(), "seed": 0}
        hist = xgb.cv(p, dtrain, num_boost_round=MAX_ROUNDS, folds=cv_folds,
                      early_stopping_rounds=100, verbose_eval=False)
        curve = list(hist["test-mae-mean"])  # list or pandas Series depending on install
        mae = float(curve[-1])
        if best is None or mae < best[0]:
            best = (mae, {**params, "n_estimators": len(curve)})
    return best[1]


def fit_trees(X: np.ndarray, y: np.ndarray, params: dict) -> xgb.Booster:
    p = {**BASE, **{k: v for k, v in params.items() if k != "n_estimators"}, "device": device(), "seed": 0}
    return xgb.train(p, xgb.DMatrix(X, label=y, missing=np.nan), num_boost_round=params["n_estimators"])


def predict(booster: xgb.Booster, X: np.ndarray) -> np.ndarray:
    return booster.predict(xgb.DMatrix(X, missing=np.nan))


def export_forest(booster: xgb.Booster) -> Forest:
    """Flatten XGBoost's trees (from its raw JSON model). XGBoost goes left when x < cond;
    Forest uses x <= threshold, so thresholds are nudged one float32 ulp down to keep
    identical decisions. Leaf values live in split_conditions for leaf nodes."""
    model = json.loads(booster.save_raw("json"))["learner"]
    base_score = float(str(model["learner_model_param"]["base_score"]).strip("[]"))
    parts = {k: [] for k in ("feature", "threshold", "left", "right", "missing_left", "is_leaf", "value")}
    roots, offset = [], 0
    for tree in model["gradient_booster"]["model"]["trees"]:
        left = np.array(tree["left_children"], np.int64)
        right = np.array(tree["right_children"], np.int64)
        cond = np.array(tree["split_conditions"], np.float32)
        leaf = left == -1
        roots.append(offset)
        parts["feature"].append(np.where(leaf, 0, tree["split_indices"]))
        parts["threshold"].append(np.where(leaf, 0.0, np.nextafter(cond, np.float32(-np.inf)).astype(np.float64)))
        parts["left"].append(np.where(leaf, 0, left + offset))
        parts["right"].append(np.where(leaf, 0, right + offset))
        parts["missing_left"].append(np.array(tree["default_left"], bool))
        parts["is_leaf"].append(leaf)
        parts["value"].append(np.where(leaf, cond, 0.0).astype(np.float64))
        offset += len(left)
    cat = {k: np.concatenate(v) for k, v in parts.items()}
    return Forest(
        roots=np.array(roots, np.int32), feature=cat["feature"].astype(np.int32), threshold=cat["threshold"],
        left=cat["left"].astype(np.int32), right=cat["right"].astype(np.int32),
        missing_left=cat["missing_left"], is_leaf=cat["is_leaf"], value=cat["value"], baseline=base_score,
    )

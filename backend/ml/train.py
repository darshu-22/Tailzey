"""Train the silhouette → measurement models on BodyM and evaluate on held-out splits.

Usage (from backend/, needs requirements-ml.txt):  .venv/Scripts/python -m ml.train
Tree models train on the GPU (CUDA) when available.
Writes:
  app/cv/models/measurement_model.npz   — numpy arrays (ridge + boosted trees per target)
  app/cv/models/measurement_model.json  — version, attribution, held-out accuracy
  ml/reports/accuracy.md                — evaluation report
"""

import json
from concurrent.futures import ProcessPoolExecutor
from datetime import date

import numpy as np

from app.cv.regressor import META_PATH, WEIGHTS_PATH, BlendModel, Ridge, pack
from app.cv.silhouette import LEVELS, feature_names

from .baseline import geometric_baseline
from .dataset import TARGETS, load_split
from .report import write_report
from .ridge import fit, fit_cv, group_kfold
from .trees import device, export_forest, fit_trees, predict, tune

EVAL_SPLITS = ("testA", "testB")
BLEND_WEIGHTS = (0.0, 0.25, 0.5, 0.75, 1.0)  # share of ridge in the ridge/trees blend
VARIANTS = (("full", "full"), ("frontOnly", "front_only"))


def metrics(pred: np.ndarray, y: np.ndarray) -> dict[str, float]:
    ok = np.isfinite(pred)
    err = pred[ok] - y[ok]
    return {"mae": float(np.mean(np.abs(err))), "p90": float(np.percentile(np.abs(err), 90)),
            "bias": float(np.mean(err)), "coverage": float(ok.mean())}


def choose_blend(X: np.ndarray, y: np.ndarray, folds: list[np.ndarray], alpha: float, params: dict) -> float:
    """Ridge share picked on out-of-fold predictions (training data only — never the test sets)."""
    oof_r, oof_t = np.empty(len(y)), np.empty(len(y))
    for val in folds:
        train = np.setdiff1d(np.arange(len(y)), val)
        oof_r[val] = fit(X[train], y[train], alpha).predict(X[val])
        oof_t[val] = predict(fit_trees(X[train], y[train], params), X[val])
    maes = {w: np.mean(np.abs(w * oof_r + (1 - w) * oof_t - y)) for w in BLEND_WEIGHTS}
    return min(maes, key=maes.get)


def train_variant(X: np.ndarray, y: np.ndarray, groups: np.ndarray) -> tuple[BlendModel, dict]:
    columns = np.flatnonzero(np.isfinite(X).any(axis=0)).astype(np.int32)
    Xc = X[:, columns]
    folds = group_kfold(groups)
    ridge, _ = fit_cv(Xc, y, groups)
    params = tune(Xc, y, folds)
    weight = choose_blend(Xc, y, folds, ridge.alpha, params)
    forest = export_forest(fit_trees(Xc, y, params))
    r = Ridge(ridge.medians, ridge.mean, ridge.std, ridge.coef, ridge.intercept)
    return BlendModel(columns, r, forest, weight, mae=float("nan")), {"ridgeAlpha": ridge.alpha, "trees": params}


def train_task(task: tuple[str, str, str]) -> tuple[str, str, dict, dict, dict]:
    """One (target, variant) model: train, evaluate on held-out splits, pack for saving.
    Runs in a worker process; several share the GPU at once."""
    key, variant, attr = task
    train = load_split("train")
    evals = {s: load_split(s) for s in EVAL_SPLITS}
    model, hyper = train_variant(getattr(train, attr), train.y[key], train.groups)
    scores = {s: metrics(np.array([model.predict(x) for x in getattr(sp, attr)]), sp.y[key])
              for s, sp in evals.items()}
    # Reported ± uncertainty = held-out MAE on the in-distribution test split.
    model = BlendModel(model.columns, model.ridge, model.forest, model.ridge_weight, scores["testA"]["mae"])
    entry = {"ridgeWeight": model.ridge_weight, **hyper, **scores}
    print(f"  {key:14s} {variant:9s} testA {scores['testA']['mae']:5.2f}  testB {scores['testB']['mae']:5.2f} cm",
          flush=True)
    return key, variant, pack(key, variant, model), entry, scores


def main(workers: int = 4) -> None:
    train = load_split("train")
    evals = {s: load_split(s) for s in EVAL_SPLITS}
    print(f"train: {len(train.groups)} photo pairs / {len(np.unique(train.groups))} people; "
          f"trees on {device()} with {workers} parallel GPU workers", flush=True)

    meta = {
        "version": f"bodym-ridge-xgb-{date.today().isoformat()}",
        "trainedOn": "BodyM train split (Ruiz et al., 3DV 2022), CC BY 4.0, https://registry.opendata.aws/bodym/",
        "levels": LEVELS.tolist(),
        "features": feature_names(),
        "targets": {key: {} for key in TARGETS.values()},
    }
    tasks = [(key, variant, attr) for key in TARGETS.values() for variant, attr in VARIANTS]
    arrays, results = {}, {key: {} for key in TARGETS.values()}
    with ProcessPoolExecutor(workers) as pool:
        for key, variant, packed, entry, scores in pool.map(train_task, tasks):
            arrays |= packed
            meta["targets"][key][variant] = entry
            results[key][variant] = scores
    for key, res in results.items():
        res["geometry"] = {s: metrics(geometric_baseline(sp.full)[key], sp.y[key]) for s, sp in evals.items()}

    WEIGHTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    np.savez_compressed(WEIGHTS_PATH, **arrays)
    META_PATH.write_text(json.dumps(meta, indent=1), encoding="utf-8")
    write_report(results, train, evals)
    print(f"Saved {WEIGHTS_PATH.name} ({WEIGHTS_PATH.stat().st_size / 1024:.0f} KB) and {META_PATH.name}")


if __name__ == "__main__":
    main()

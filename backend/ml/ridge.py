"""Ridge regression in plain numpy (no ML dependency at runtime).

The fitted model is a few arrays (medians for NaN imputation, mean/std scaling,
coefficients) that serialise to JSON and evaluate with one dot product.
"""

from dataclasses import dataclass

import numpy as np

ALPHAS = (0.3, 1.0, 3.0, 10.0, 30.0, 100.0, 300.0, 1000.0)


@dataclass
class RidgeModel:
    medians: np.ndarray
    mean: np.ndarray
    std: np.ndarray
    coef: np.ndarray
    intercept: float
    alpha: float

    def predict(self, X: np.ndarray) -> np.ndarray:
        X = np.where(np.isfinite(X), X, self.medians)
        return ((X - self.mean) / self.std) @ self.coef + self.intercept

    def to_dict(self) -> dict:
        return {
            "medians": self.medians.tolist(), "mean": self.mean.tolist(), "std": self.std.tolist(),
            "coef": self.coef.tolist(), "intercept": self.intercept, "alpha": self.alpha,
        }


def fit(X: np.ndarray, y: np.ndarray, alpha: float) -> RidgeModel:
    medians = np.nanmedian(X, axis=0)
    medians = np.where(np.isfinite(medians), medians, 0.0)  # all-NaN columns (front-only side block)
    Xi = np.where(np.isfinite(X), X, medians)
    mean, std = Xi.mean(axis=0), Xi.std(axis=0)
    std = np.where(std > 1e-9, std, 1.0)
    Z = (Xi - mean) / std
    y_mean = float(y.mean())
    coef = np.linalg.solve(Z.T @ Z + alpha * np.eye(Z.shape[1]), Z.T @ (y - y_mean))
    return RidgeModel(medians, mean, std, coef, y_mean, alpha)


def group_kfold(groups: np.ndarray, k: int = 5, seed: int = 0) -> list[np.ndarray]:
    """Fold index arrays where every subject's photos stay in the same fold."""
    uniq = np.unique(groups)
    rng = np.random.default_rng(seed)
    rng.shuffle(uniq)
    fold_of = {g: i % k for i, g in enumerate(uniq)}
    ids = np.array([fold_of[g] for g in groups])
    return [np.flatnonzero(ids == i) for i in range(k)]


def fit_cv(X: np.ndarray, y: np.ndarray, groups: np.ndarray) -> tuple[RidgeModel, dict[float, float]]:
    """Choose alpha by grouped 5-fold CV (MAE), then refit on all data."""
    folds = group_kfold(groups)
    scores = {}
    for alpha in ALPHAS:
        errs = []
        for val in folds:
            train = np.setdiff1d(np.arange(len(y)), val)
            m = fit(X[train], y[train], alpha)
            errs.append(np.abs(m.predict(X[val]) - y[val]))
        scores[alpha] = float(np.mean(np.concatenate(errs)))
    best = min(scores, key=scores.get)
    return fit(X, y, best), scores

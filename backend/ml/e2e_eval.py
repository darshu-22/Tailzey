"""End-to-end check of the live pipeline on held-out BodyM people (see ml/live.py).

Usage (from backend/):  .venv/Scripts/python -m ml.e2e_eval [n_photos] [split]
"""

import sys

import numpy as np

from app.cv.regressor import MeasurementModel

from .live import live_errors


def main(n: int = 200, split: str = "testA") -> None:
    errors, used = live_errors(split, n, MeasurementModel())
    print(f"{split}: {used}/{n} photo pairs passed detection + quality gates")
    for variant, errs in errors.items():
        print(f"\n[{variant}] {'measurement':14s} {'MAE':>6s} {'bias':>6s}   (cm, live pipeline vs ground truth)")
        for key, e in errs.items():
            print(f"{'':12s}{key:14s} {np.mean(np.abs(e)):6.2f} {np.mean(e):+6.2f}")


if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 200, sys.argv[2] if len(sys.argv) > 2 else "testA")

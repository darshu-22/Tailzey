"""Correct the systematic gap between training masks (BodyM) and live MediaPipe masks.

1. Run TRAINING-split people through the live pipeline and measure the mean bias per
   measurement and model variant (the test splits are never used for fitting).
2. Store those offsets in the model metadata (`liveCalibration.offsets`); the runtime
   subtracts them.
3. Re-run held-out testA people through the corrected live pipeline and store that MAE as
   the ± reported to users (`liveCalibration.mae`) — the honest end-to-end error.

Usage (from backend/):  .venv/Scripts/python -m ml.calibrate_live [n_train] [n_test]
"""

import json
import sys
from datetime import date

import numpy as np

from app.cv.regressor import META_PATH, MeasurementModel

from .live import live_errors


def main(n_train: int = 2000, n_test: int = 1684) -> None:
    meta = json.loads(META_PATH.read_text(encoding="utf-8"))
    meta.pop("liveCalibration", None)
    META_PATH.write_text(json.dumps(meta, indent=1), encoding="utf-8")

    errors, used = live_errors("train", n_train, MeasurementModel())
    offsets = {v: {k: round(float(np.mean(e)), 3) for k, e in errs.items()} for v, errs in errors.items()}
    meta["liveCalibration"] = {"fittedOn": f"BodyM train, {used} photo pairs, {date.today().isoformat()}",
                               "offsets": offsets}
    META_PATH.write_text(json.dumps(meta, indent=1), encoding="utf-8")
    print(f"offsets from {used} training pairs: {offsets}")

    errors, used = live_errors("testA", n_test, MeasurementModel())
    meta["liveCalibration"]["mae"] = {v: {k: round(float(np.mean(np.abs(e))), 2) for k, e in errs.items()}
                                      for v, errs in errors.items()}
    meta["liveCalibration"]["evaluatedOn"] = f"BodyM testA, {used} photo pairs"
    META_PATH.write_text(json.dumps(meta, indent=1), encoding="utf-8")
    for variant, errs in errors.items():
        print(f"[{variant}] testA live pipeline, same {used} pairs — MAE before → after correction (bias after):")
        for key, e in errs.items():
            raw = e + offsets[variant][key]
            print(f"    {key:14s} {np.mean(np.abs(raw)):5.2f} → {np.mean(np.abs(e)):5.2f}   ({np.mean(e):+5.2f})")


if __name__ == "__main__":
    main(*(int(a) for a in sys.argv[1:3]))

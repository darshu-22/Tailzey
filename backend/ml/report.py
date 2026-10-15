"""Write the markdown accuracy report produced by ml.train."""

from datetime import date
from pathlib import Path

import numpy as np

REPORT_PATH = Path(__file__).resolve().parent / "reports" / "accuracy.md"
METHODS = (("geometry", "Geometry only"), ("frontOnly", "Model, front photo only"), ("full", "Model, front + side"))


def _row(name: str, res: dict, split: str) -> str:
    cells = []
    for method, _ in METHODS:
        m = res[method][split]
        cells.append(f"{m['mae']:.2f} / {m['p90']:.2f}")
    return f"| {name} | " + " | ".join(cells) + " |"


def write_report(results: dict, train, evals: dict) -> None:
    lines = [
        "# Measurement accuracy",
        "",
        f"Generated {date.today().isoformat()} by `python -m ml.train`.",
        "",
        "Training data: BodyM train split. It has "
        f"{len(train.groups)} front + side silhouette pairs from {len(np.unique(train.groups))} people, "
        "with tape-style ground truth. Photo pairs with the head or feet cut off are excluded, the same "
        "rule the live API applies.",
        "",
        "Each cell is **MAE / 90th-percentile absolute error in cm**, measured on people the model never saw.",
        "",
    ]
    for split, sp in evals.items():
        desc = ("in-distribution held-out people" if split == "testA"
                else "harder held-out set (different capture conditions)")
        lines += [
            f"## {split}: {desc}",
            "",
            f"{len(sp.groups)} photo pairs from {len(np.unique(sp.groups))} people.",
            "",
            "| Measurement | " + " | ".join(label for _, label in METHODS) + " |",
            "|---|" + "---|" * len(METHODS),
        ]
        lines += [_row(key, res, split) for key, res in results.items()]
        lines.append("")
    lines += [
        "## Notes",
        "",
        "- **Units and scale.** Height is the user-supplied value (BodyM `height_cm`), so the scale comes from it.",
        "- **Shoulder width and arm length** follow BodyM's definitions (biacromial breadth; "
        "shoulder to wrist). These can differ slightly from a tailor's tape method.",
        "- **What the app reports.** The ± values the live API shows are the testA MAE of the model actually used.",
        "- **Neck** is not in BodyM and still uses the landmark geometry method.",
        "- **Real-world error may be higher.** Expect larger errors from loose clothing, poor segmentation, or "
        "camera tilt, which are not represented in BodyM.",
        "",
    ]
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")

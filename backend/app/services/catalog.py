"""Catalog + measurement rules exported from the frontend (see scripts/export_catalog.mjs)."""

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

CATALOG_PATH = Path(__file__).resolve().parents[1] / "data" / "catalog.json"

MEASUREMENT_KEYS = (
    "height", "neck", "shoulderWidth", "chest", "waist", "hip", "armLength", "legLength", "underbust",
)
FIELD_STATUSES = ("user_entered", "camera_estimate", "not_recorded")


@lru_cache
def get_catalog() -> dict[str, Any]:
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


@lru_cache
def garments_by_id() -> dict[str, dict[str, Any]]:
    return {g["id"]: g for g in get_catalog()["garments"]}


@lru_cache
def measurement_ranges() -> dict[str, dict[str, float]]:
    return {f["id"]: f for f in get_catalog()["measurementFields"]}


def validate_design_options(
    garment_id: str, color_id: str, style_id: str, fit_id: str, custom_options: dict[str, str]
) -> dict[str, str]:
    cat = get_catalog()
    errors: dict[str, str] = {}
    garment = garments_by_id().get(garment_id)
    if garment is None:
        errors["garmentId"] = "Unknown garment."
    if color_id not in cat["colors"]:
        errors["colorId"] = "Unknown colour."
    if style_id not in cat["styles"]:
        errors["styleId"] = "Unknown style."
    if fit_id not in cat["fits"]:
        errors["fitId"] = "Unknown fit."
    if garment is not None:
        controls = garment["customControls"]
        for key, value in custom_options.items():
            if key not in controls:
                errors[f"customOptions.{key}"] = f"'{key}' is not an option for {garment['name']}."
            elif value not in controls[key]["options"]:
                errors[f"customOptions.{key}"] = f"Invalid choice for {controls[key]['label']}."
    return errors


def validate_size(selected_size: str | None, size_type: str | None, garment_id: str | None = None) -> dict[str, str]:
    if selected_size is None and size_type is None:
        return {}
    cat = get_catalog()
    if size_type == "letter":
        ok = selected_size in cat["letterSizes"]
    elif size_type == "numeric":
        pools = [cat["numericSizes"].get(garment_id, [])] if garment_id else cat["numericSizes"].values()
        ok = any(selected_size in p for p in pools)
    else:
        return {"selectedSizeType": "Must be 'letter' or 'numeric'."}
    return {} if ok else {"selectedSize": "Unknown size for the chosen size type."}


def validate_measurement_values(values: dict[str, float | None], unit: str) -> dict[str, str]:
    ranges = measurement_ranges()
    lo_key, hi_key = ("minCm", "maxCm") if unit == "cm" else ("minIn", "maxIn")
    errors: dict[str, str] = {}
    for key, value in values.items():
        if key not in ranges:
            errors[f"values.{key}"] = "Unknown measurement."
            continue
        if value is None:
            continue
        lo, hi = ranges[key][lo_key], ranges[key][hi_key]
        if not (lo <= value <= hi):
            errors[f"values.{key}"] = f"Must be between {lo} and {hi} {unit}."
    return errors

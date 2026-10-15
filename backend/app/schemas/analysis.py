from typing import Literal

from pydantic import Field

from .common import CamelModel


class MeasurementEstimate(CamelModel):
    value: float | None = Field(description="Centimetres; null when it could not be measured")
    uncertainty: float | None = Field(description="± cm: typical error of this estimate, measured on held-out people")
    confidence: Literal["high", "medium", "low"] | None
    source: Literal["user_entered", "camera_estimate", "not_recorded"]
    method: str | None = None
    reason: str | None = Field(default=None, description="Why the value is missing")


class ViewReport(CamelModel):
    provided: bool
    used: bool
    issues: list[str] = Field(default_factory=list)


class AnalysisOut(CamelModel):
    unit: Literal["cm"] = "cm"
    measurements: dict[str, MeasurementEstimate]
    views: dict[str, ViewReport]
    warnings: list[str]
    model: str
    processing_ms: int
    disclaimer: str

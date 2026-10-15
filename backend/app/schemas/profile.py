from datetime import datetime
from typing import Any, Literal

from pydantic import Field, field_validator

from ..services.catalog import FIELD_STATUSES, MEASUREMENT_KEYS
from .common import CamelModel, StrictCamelModel
from .design import SizeType

Unit = Literal["cm", "in"]
FieldStatus = Literal["user_entered", "camera_estimate", "not_recorded"]
assert set(FieldStatus.__args__) == set(FIELD_STATUSES)


def _check_keys(d: dict[str, Any] | None, what: str) -> dict[str, Any] | None:
    if d is not None:
        unknown = set(d) - set(MEASUREMENT_KEYS)
        if unknown:
            raise ValueError(f"Unknown {what} key(s): {', '.join(sorted(unknown))}")
    return d


class ProfileBase(StrictCamelModel):
    profile_name: str = Field(default="My measurements", min_length=1, max_length=80)
    unit: Unit
    # Missing measurements are null/absent — never zero.
    values: dict[str, float | None] = Field(default_factory=dict)
    field_status: dict[str, FieldStatus] = Field(default_factory=dict)
    fit_preference: str | None = Field(default=None, max_length=16)
    selected_size: str | None = Field(default=None, max_length=16)
    selected_size_type: SizeType | None = None
    adjustments: dict[str, float] = Field(default_factory=dict, max_length=16)
    camera_capture_count: int = Field(default=0, ge=0, le=6)
    is_camera_completed: bool = False

    @field_validator("values", "field_status", "adjustments")
    @classmethod
    def _known_keys(cls, v, info):
        return _check_keys(v, info.field_name)


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(StrictCamelModel):
    profile_name: str | None = Field(default=None, min_length=1, max_length=80)
    unit: Unit | None = None
    values: dict[str, float | None] | None = None
    field_status: dict[str, FieldStatus] | None = None
    fit_preference: str | None = Field(default=None, max_length=16)
    selected_size: str | None = Field(default=None, max_length=16)
    selected_size_type: SizeType | None = None
    adjustments: dict[str, float] | None = Field(default=None, max_length=16)
    camera_capture_count: int | None = Field(default=None, ge=0, le=6)
    is_camera_completed: bool | None = None

    @field_validator("values", "field_status", "adjustments")
    @classmethod
    def _known_keys(cls, v, info):
        return _check_keys(v, info.field_name)


class ProfileOut(CamelModel):
    id: str
    profile_name: str
    unit: str
    values: dict[str, float | None]
    field_status: dict[str, str]
    fit_preference: str | None
    selected_size: str | None
    selected_size_type: str | None
    adjustments: dict[str, float]
    camera_capture_count: int
    is_camera_completed: bool
    created_at: datetime
    updated_at: datetime

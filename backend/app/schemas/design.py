from datetime import datetime
from typing import Literal

from pydantic import Field

from .common import CamelModel, StrictCamelModel

SizeType = Literal["letter", "numeric"]
IdStr = Field(min_length=1, max_length=32)


class DesignBase(StrictCamelModel):
    name: str = Field(default="Untitled design", min_length=1, max_length=120)
    garment_id: str = IdStr
    color_id: str = IdStr
    style_id: str = IdStr
    fit_id: str = IdStr
    custom_options: dict[str, str] = Field(default_factory=dict, max_length=16)
    selected_size: str | None = Field(default=None, max_length=16)
    selected_size_type: SizeType | None = None
    measurement_profile_id: str | None = Field(default=None, max_length=36)


class DesignCreate(DesignBase):
    pass


class DesignUpdate(StrictCamelModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    garment_id: str | None = Field(default=None, min_length=1, max_length=32)
    color_id: str | None = Field(default=None, min_length=1, max_length=32)
    style_id: str | None = Field(default=None, min_length=1, max_length=32)
    fit_id: str | None = Field(default=None, min_length=1, max_length=32)
    custom_options: dict[str, str] | None = Field(default=None, max_length=16)
    selected_size: str | None = Field(default=None, max_length=16)
    selected_size_type: SizeType | None = None
    measurement_profile_id: str | None = Field(default=None, max_length=36)


class DesignOut(CamelModel):
    id: str
    name: str
    garment_id: str
    color_id: str
    style_id: str
    fit_id: str
    custom_options: dict[str, str]
    selected_size: str | None
    selected_size_type: str | None
    measurement_profile_id: str | None
    created_at: datetime
    updated_at: datetime

from datetime import datetime

from pydantic import EmailStr, Field, field_validator

from .common import CamelModel, StrictCamelModel


class RegisterIn(StrictCamelModel):
    display_name: str = Field(min_length=1, max_length=80)
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=8, max_length=128)

    @field_validator("display_name")
    @classmethod
    def _strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Display name is required")
        return v


class LoginIn(StrictCamelModel):
    email: EmailStr = Field(max_length=254)
    password: str = Field(min_length=1, max_length=128)


class UserOut(CamelModel):
    id: str
    display_name: str
    email: str
    created_at: datetime

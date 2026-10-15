from typing import Any

from sqlalchemy import JSON, Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, new_id


class MeasurementProfile(TimestampMixin, Base):
    __tablename__ = "measurement_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    profile_name: Mapped[str] = mapped_column(String(80))
    # Values are stored exactly as confirmed by the user, in `unit` — the backend never converts.
    unit: Mapped[str] = mapped_column(String(2))
    values: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    field_status: Mapped[dict[str, str]] = mapped_column(JSON, default=dict)
    fit_preference: Mapped[str | None] = mapped_column(String(16), nullable=True)
    selected_size: Mapped[str | None] = mapped_column(String(16), nullable=True)
    selected_size_type: Mapped[str | None] = mapped_column(String(16), nullable=True)
    adjustments: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    camera_capture_count: Mapped[int] = mapped_column(Integer, default=0)
    is_camera_completed: Mapped[bool] = mapped_column(Boolean, default=False)

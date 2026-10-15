from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, new_id


class Design(TimestampMixin, Base):
    __tablename__ = "designs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    garment_id: Mapped[str] = mapped_column(String(32))
    color_id: Mapped[str] = mapped_column(String(32))
    style_id: Mapped[str] = mapped_column(String(32))
    fit_id: Mapped[str] = mapped_column(String(32))
    custom_options: Mapped[dict[str, str]] = mapped_column(JSON, default=dict)
    selected_size: Mapped[str | None] = mapped_column(String(16), nullable=True)
    selected_size_type: Mapped[str | None] = mapped_column(String(16), nullable=True)
    # Deleting a profile keeps the design but detaches it.
    measurement_profile_id: Mapped[str | None] = mapped_column(
        ForeignKey("measurement_profiles.id", ondelete="SET NULL"), nullable=True, index=True
    )

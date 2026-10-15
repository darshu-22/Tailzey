"""Data access for user-owned records. Every query is scoped to the owner's id."""

from typing import Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models import Design, MeasurementProfile

ModelT = TypeVar("ModelT", Design, MeasurementProfile)


class OwnedRepository(Generic[ModelT]):
    def __init__(self, db: Session, model: type[ModelT]):
        self.db = db
        self.model = model

    def get(self, user_id: str, record_id: str) -> ModelT | None:
        m = self.model
        return self.db.scalar(select(m).where(m.id == record_id, m.user_id == user_id))

    def exists(self, user_id: str, record_id: str) -> bool:
        m = self.model
        return self.db.scalar(select(m.id).where(m.id == record_id, m.user_id == user_id)) is not None

    def list(self, user_id: str, limit: int, offset: int) -> tuple[list[ModelT], int]:
        m = self.model
        base = select(m).where(m.user_id == user_id)
        total = self.db.scalar(select(func.count()).select_from(base.subquery())) or 0
        rows = self.db.scalars(base.order_by(m.updated_at.desc()).limit(limit).offset(offset)).all()
        return list(rows), total

    def add(self, record: ModelT) -> ModelT:
        self.db.add(record)
        self.db.commit()
        return record

    def save(self) -> None:
        self.db.commit()

    def delete(self, record: ModelT) -> None:
        self.db.delete(record)
        self.db.commit()


def designs(db: Session) -> OwnedRepository[Design]:
    return OwnedRepository(db, Design)


def profiles(db: Session) -> OwnedRepository[MeasurementProfile]:
    return OwnedRepository(db, MeasurementProfile)

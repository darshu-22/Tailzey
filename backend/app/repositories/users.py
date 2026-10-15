from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..models import User


class EmailTakenError(Exception):
    pass


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def by_email(self, email: str) -> User | None:
        return self.db.scalar(select(User).where(User.email == email))

    def email_exists(self, email: str) -> bool:
        return self.db.scalar(select(User.id).where(User.email == email)) is not None

    def create(self, user: User) -> User:
        self.db.add(user)
        try:
            self.db.flush()
        except IntegrityError as exc:  # concurrent registration with the same email
            self.db.rollback()
            raise EmailTakenError from exc
        return user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()

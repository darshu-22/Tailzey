from fastapi import Response
from sqlalchemy.orm import Session

from ..core.exceptions import ApiError
from ..core.security.passwords import hash_password, verify_password
from ..core.security.sessions import clear_session_cookie, create_session, revoke_session
from ..models import User
from ..repositories.users import EmailTakenError, UserRepository
from ..schemas import LoginIn, RegisterIn

_EMAIL_TAKEN = ApiError(409, "EMAIL_TAKEN", "An account with this email already exists.",
                        {"email": "This email is already registered."})


def normalize_email(email: str) -> str:
    return email.strip().lower()


def register(db: Session, body: RegisterIn, response: Response) -> User:
    users = UserRepository(db)
    email = normalize_email(body.email)
    if users.email_exists(email):
        raise _EMAIL_TAKEN
    try:
        user = users.create(User(email=email, display_name=body.display_name,
                                 password_hash=hash_password(body.password)))
    except EmailTakenError:
        raise _EMAIL_TAKEN from None
    create_session(db, user, response)
    return user


def login(db: Session, body: LoginIn, response: Response) -> User:
    user = UserRepository(db).by_email(normalize_email(body.email))
    ok = verify_password(body.password, user.password_hash if user else None)
    if not ok or user is None or user.status != "active":
        raise ApiError(401, "INVALID_CREDENTIALS", "Incorrect email or password.")
    create_session(db, user, response)
    return user


def logout(db: Session, token: str | None, response: Response) -> None:
    revoke_session(db, token)
    clear_session_cookie(response)


def delete_account(db: Session, user: User, response: Response) -> None:
    """Permanently delete the account and (via cascades) its designs, profiles and sessions."""
    UserRepository(db).delete(user)
    clear_session_cookie(response)

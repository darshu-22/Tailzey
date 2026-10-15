"""Server-side sessions behind an HttpOnly cookie. Only a SHA-256 of the token is stored."""

import hashlib
import secrets
from datetime import timedelta

from fastapi import Response
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from ...models import AuthSession, User, utcnow
from ..config import get_settings


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_session(db: Session, user: User, response: Response) -> None:
    s = get_settings()
    token = secrets.token_urlsafe(32)
    db.add(
        AuthSession(
            user_id=user.id,
            token_hash=_hash_token(token),
            expires_at=utcnow() + timedelta(hours=s.session_ttl_hours),
        )
    )
    # Opportunistic cleanup of this user's expired sessions.
    db.execute(delete(AuthSession).where(AuthSession.user_id == user.id, AuthSession.expires_at < utcnow()))
    db.commit()
    response.set_cookie(
        s.session_cookie_name,
        token,
        max_age=s.session_ttl_hours * 3600,
        httponly=True,
        secure=s.cookie_secure,
        samesite="lax",
        path="/api",
    )


def resolve_session(db: Session, token: str | None) -> User | None:
    if not token:
        return None
    sess = db.scalar(select(AuthSession).where(AuthSession.token_hash == _hash_token(token)))
    if sess is None:
        return None
    if sess.expires_at <= utcnow():
        db.delete(sess)
        db.commit()
        return None
    user = sess.user
    return user if user.status == "active" else None


def revoke_session(db: Session, token: str | None) -> None:
    if token:
        db.execute(delete(AuthSession).where(AuthSession.token_hash == _hash_token(token)))
        db.commit()


def clear_session_cookie(response: Response) -> None:
    s = get_settings()
    response.delete_cookie(s.session_cookie_name, path="/api", secure=s.cookie_secure, httponly=True, samesite="lax")

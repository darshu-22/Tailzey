from typing import Annotated

from fastapi import Depends, Query, Request
from sqlalchemy.orm import Session

from ..core.config import get_settings
from ..core.database import get_db
from ..core.exceptions import unauthorized
from ..core.security.rate_limit import rate_limiter
from ..core.security.sessions import resolve_session
from ..models import User

DbSession = Annotated[Session, Depends(get_db)]


def session_token(request: Request) -> str | None:
    return request.cookies.get(get_settings().session_cookie_name)


def get_current_user(request: Request, db: DbSession) -> User:
    # Identity always comes from the session cookie — never from a client-supplied userId.
    user = resolve_session(db, session_token(request))
    if user is None:
        raise unauthorized()
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def auth_rate_limit(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    rate_limiter.check(f"auth:{ip}", get_settings().auth_rate_limit_per_minute)


class Pagination:
    def __init__(self, limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0)):
        self.limit = limit
        self.offset = offset

    def page(self, rows: list, total: int) -> dict:
        return {"data": rows, "meta": {"total": total, "limit": self.limit, "offset": self.offset}}


PageParams = Annotated[Pagination, Depends()]

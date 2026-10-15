from fastapi import APIRouter, Depends, Request, Response, status

from ...schemas import Envelope, LoginIn, RegisterIn, UserOut
from ...services import auth_service
from ..deps import CurrentUser, DbSession, auth_rate_limit, session_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=Envelope[UserOut],
             dependencies=[Depends(auth_rate_limit)])
def register(body: RegisterIn, response: Response, db: DbSession):
    return {"data": auth_service.register(db, body, response)}


@router.post("/login", response_model=Envelope[UserOut], dependencies=[Depends(auth_rate_limit)])
def login(body: LoginIn, response: Response, db: DbSession):
    return {"data": auth_service.login(db, body, response)}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, response: Response, db: DbSession):
    auth_service.logout(db, session_token(request), response)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.get("/me", response_model=Envelope[UserOut])
def me(user: CurrentUser):
    return {"data": user}


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(user: CurrentUser, response: Response, db: DbSession):
    """Permanently delete the account and all of its designs, profiles and sessions."""
    auth_service.delete_account(db, user, response)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response

from fastapi import APIRouter, Response, status

from ...schemas import Envelope, Page, ProfileCreate, ProfileOut, ProfileUpdate
from ...services import profile_service
from ..deps import CurrentUser, DbSession, PageParams

router = APIRouter(prefix="/measurement-profiles", tags=["measurement profiles"])


@router.get("", response_model=Page[ProfileOut])
def list_profiles(user: CurrentUser, db: DbSession, page: PageParams):
    return page.page(*profile_service.list_page(db, user, page.limit, page.offset))


@router.post("", status_code=status.HTTP_201_CREATED, response_model=Envelope[ProfileOut])
def create_profile(body: ProfileCreate, user: CurrentUser, db: DbSession):
    return {"data": profile_service.create(db, user, body)}


@router.get("/{profile_id}", response_model=Envelope[ProfileOut])
def get_profile(profile_id: str, user: CurrentUser, db: DbSession):
    return {"data": profile_service.get(db, user, profile_id)}


@router.patch("/{profile_id}", response_model=Envelope[ProfileOut])
def update_profile(profile_id: str, body: ProfileUpdate, user: CurrentUser, db: DbSession):
    return {"data": profile_service.update(db, user, profile_id, body)}


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(profile_id: str, user: CurrentUser, db: DbSession):
    profile_service.delete(db, user, profile_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

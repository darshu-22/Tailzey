from fastapi import APIRouter, Response, status

from ...schemas import DesignCreate, DesignOut, DesignUpdate, Envelope, Page
from ...services import design_service
from ..deps import CurrentUser, DbSession, PageParams

router = APIRouter(prefix="/designs", tags=["designs"])


@router.get("", response_model=Page[DesignOut])
def list_designs(user: CurrentUser, db: DbSession, page: PageParams):
    return page.page(*design_service.list_page(db, user, page.limit, page.offset))


@router.post("", status_code=status.HTTP_201_CREATED, response_model=Envelope[DesignOut])
def create_design(body: DesignCreate, user: CurrentUser, db: DbSession):
    return {"data": design_service.create(db, user, body)}


@router.get("/{design_id}", response_model=Envelope[DesignOut])
def get_design(design_id: str, user: CurrentUser, db: DbSession):
    return {"data": design_service.get(db, user, design_id)}


@router.patch("/{design_id}", response_model=Envelope[DesignOut])
def update_design(design_id: str, body: DesignUpdate, user: CurrentUser, db: DbSession):
    return {"data": design_service.update(db, user, design_id, body)}


@router.delete("/{design_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_design(design_id: str, user: CurrentUser, db: DbSession):
    design_service.delete(db, user, design_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

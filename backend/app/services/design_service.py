from sqlalchemy.orm import Session

from ..core.exceptions import not_found, validation_error
from ..models import Design, User
from ..repositories.owned import designs, profiles
from ..schemas import DesignCreate, DesignUpdate
from .catalog import validate_design_options, validate_size

NON_NULLABLE = ("name", "garment_id", "color_id", "style_id", "fit_id", "custom_options")


def _validate(db: Session, user: User, d: Design) -> None:
    errors = validate_design_options(d.garment_id, d.color_id, d.style_id, d.fit_id, d.custom_options or {})
    errors |= validate_size(d.selected_size, d.selected_size_type, d.garment_id)
    if d.measurement_profile_id and not profiles(db).exists(user.id, d.measurement_profile_id):
        errors["measurementProfileId"] = "Measurement profile not found."
    if errors:
        raise validation_error(errors)


def get(db: Session, user: User, design_id: str) -> Design:
    design = designs(db).get(user.id, design_id)
    if design is None:
        raise not_found("Design")
    return design


def list_page(db: Session, user: User, limit: int, offset: int) -> tuple[list[Design], int]:
    return designs(db).list(user.id, limit, offset)


def create(db: Session, user: User, body: DesignCreate) -> Design:
    design = Design(user_id=user.id, **body.model_dump())
    _validate(db, user, design)
    return designs(db).add(design)


def update(db: Session, user: User, design_id: str, body: DesignUpdate) -> Design:
    design = get(db, user, design_id)
    changes = body.model_dump(exclude_unset=True)
    nulls = {f: "Cannot be null." for f in NON_NULLABLE if f in changes and changes[f] is None}
    if nulls:
        raise validation_error(nulls)
    for k, v in changes.items():
        setattr(design, k, v)
    # Re-validate the merged record (e.g. changing garment invalidates its custom options).
    _validate(db, user, design)
    designs(db).save()
    return design


def delete(db: Session, user: User, design_id: str) -> None:
    designs(db).delete(get(db, user, design_id))  # hard delete

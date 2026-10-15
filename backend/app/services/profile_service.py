from sqlalchemy.orm import Session

from ..core.exceptions import not_found, validation_error
from ..models import MeasurementProfile, User
from ..repositories.owned import profiles
from ..schemas import ProfileCreate, ProfileUpdate
from .catalog import get_catalog, validate_measurement_values, validate_size

NON_NULLABLE = ("profile_name", "unit", "values", "field_status", "adjustments",
                "camera_capture_count", "is_camera_completed")
MERGED_MAPS = ("values", "field_status", "adjustments")


def _validate(p: MeasurementProfile) -> None:
    errors = validate_measurement_values(p.values or {}, p.unit)
    errors |= validate_size(p.selected_size, p.selected_size_type)
    if p.fit_preference is not None and p.fit_preference not in get_catalog()["fitPreferences"]:
        errors["fitPreference"] = "Unknown fit preference."
    for key, value in (p.values or {}).items():
        # A value marked "not recorded" must actually be empty.
        if (p.field_status or {}).get(key) == "not_recorded" and value is not None:
            errors[f"fieldStatus.{key}"] = "Marked not recorded but a value was given."
    if errors:
        raise validation_error(errors)


def get(db: Session, user: User, profile_id: str) -> MeasurementProfile:
    profile = profiles(db).get(user.id, profile_id)
    if profile is None:
        raise not_found("Measurement profile")
    return profile


def list_page(db: Session, user: User, limit: int, offset: int) -> tuple[list[MeasurementProfile], int]:
    return profiles(db).list(user.id, limit, offset)


def create(db: Session, user: User, body: ProfileCreate) -> MeasurementProfile:
    profile = MeasurementProfile(user_id=user.id, **body.model_dump())
    _validate(profile)
    return profiles(db).add(profile)


def update(db: Session, user: User, profile_id: str, body: ProfileUpdate) -> MeasurementProfile:
    profile = get(db, user, profile_id)
    changes = body.model_dump(exclude_unset=True)
    nulls = {f: "Cannot be null." for f in NON_NULLABLE if f in changes and changes[f] is None}
    if nulls:
        raise validation_error(nulls)
    # Maps are merged per key so a PATCH of one measurement keeps the rest;
    # an explicit null clears a value.
    for key in MERGED_MAPS:
        if key in changes:
            changes[key] = {**(getattr(profile, key) or {}), **changes[key]}
    for k, v in changes.items():
        setattr(profile, k, v)
    _validate(profile)
    profiles(db).save()
    return profile


def delete(db: Session, user: User, profile_id: str) -> None:
    profiles(db).delete(get(db, user, profile_id))  # hard delete; linked designs are detached

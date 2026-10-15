from fastapi import APIRouter
from sqlalchemy import text

from ...core.config import get_settings
from ...cv.regressor import get_measurement_model
from ...services.catalog import get_catalog
from ..deps import DbSession

router = APIRouter(tags=["meta"])


@router.get("/health")
def health(db: DbSession):
    try:
        db.execute(text("SELECT 1"))
        database = "ok"
    except Exception:
        database = "unavailable"
    ready = get_settings().pose_model_path.exists() and get_measurement_model() is not None
    return {"data": {
        "status": "ok" if database == "ok" else "degraded",
        "database": database,
        "measurementModel": "ready" if ready else "missing",
    }}


@router.get("/catalog")
def catalog():
    """Garment/colour/style/fit options and measurement ranges the server validates against."""
    return {"data": get_catalog()}

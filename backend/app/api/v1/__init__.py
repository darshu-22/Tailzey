from fastapi import APIRouter

from . import auth, designs, measurement_profiles, measurements, meta

router = APIRouter(prefix="/api/v1")
for module in (meta, auth, designs, measurement_profiles, measurements):
    router.include_router(module.router)

"""Tailzey API application factory."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from .api.v1 import router as api_v1
from .core.config import get_settings
from .core.error_handlers import install_error_handlers
from .core.middleware import install_middleware
from .cv.detector import shutdown_detector

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    shutdown_detector()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Tailzey API",
        version="1.1.0",
        lifespan=lifespan,
        docs_url="/api/v1/docs",
        openapi_url="/api/v1/openapi.json",
        redoc_url=None,
    )
    install_middleware(app, settings)
    install_error_handlers(app)
    app.include_router(api_v1)
    return app


app = create_app()

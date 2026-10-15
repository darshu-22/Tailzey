"""Uniform error envelope: {"error": {code, message, fieldErrors?, requestId}}."""

import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from .exceptions import ApiError

log = logging.getLogger("tailzey")

_STATUS_CODES = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    409: "CONFLICT",
    413: "PAYLOAD_TOO_LARGE",
    415: "UNSUPPORTED_MEDIA_TYPE",
    422: "VALIDATION_ERROR",
    429: "RATE_LIMITED",
}


def error_body(request: Request, code: str, message: str, field_errors: dict[str, str] | None = None) -> dict[str, Any]:
    err: dict[str, Any] = {"code": code, "message": message}
    if field_errors:
        err["fieldErrors"] = field_errors
    rid = getattr(request.state, "request_id", None)
    if rid:
        err["requestId"] = rid
    return {"error": err}


def _loc_to_field(loc: tuple) -> str:
    parts = [str(p) for p in loc if p not in ("body", "query", "path", "form")]
    return ".".join(parts) or "request"


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def _api_error(request: Request, exc: ApiError):
        return JSONResponse(
            error_body(request, exc.code, exc.message, exc.field_errors), exc.status, headers=exc.headers
        )

    @app.exception_handler(RequestValidationError)
    async def _validation(request: Request, exc: RequestValidationError):
        fields: dict[str, str] = {}
        for e in exc.errors():
            fields.setdefault(_loc_to_field(tuple(e.get("loc", ()))), e.get("msg", "Invalid value"))
        return JSONResponse(
            error_body(request, "VALIDATION_ERROR", "Please correct the highlighted fields.", fields), 422
        )

    @app.exception_handler(StarletteHTTPException)
    async def _http(request: Request, exc: StarletteHTTPException):
        code = _STATUS_CODES.get(exc.status_code, "ERROR")
        msg = exc.detail if isinstance(exc.detail, str) else "Request failed."
        return JSONResponse(error_body(request, code, msg), exc.status_code)

    @app.exception_handler(Exception)
    async def _unhandled(request: Request, exc: Exception):
        # Log the stack trace server-side only; never leak it to clients.
        log.exception("Unhandled error (request %s)", getattr(request.state, "request_id", "-"))
        return JSONResponse(error_body(request, "INTERNAL_ERROR", "Something went wrong. Please try again."), 500)

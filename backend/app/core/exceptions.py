"""Domain exception raised anywhere in the app and rendered as the API error envelope."""


class ApiError(Exception):
    def __init__(
        self,
        status: int,
        code: str,
        message: str,
        field_errors: dict[str, str] | None = None,
        headers: dict[str, str] | None = None,
    ):
        super().__init__(message)
        self.status = status
        self.code = code
        self.message = message
        self.field_errors = field_errors
        self.headers = headers


def not_found(what: str = "Resource") -> ApiError:
    # Same response for "missing" and "owned by someone else" so IDs can't be probed.
    return ApiError(404, "NOT_FOUND", f"{what} not found.")


def validation_error(field_errors: dict[str, str], message: str | None = None) -> ApiError:
    return ApiError(422, "VALIDATION_ERROR", message or "Please correct the highlighted fields.", field_errors)


def unauthorized(message: str = "Please sign in to continue.") -> ApiError:
    return ApiError(401, "UNAUTHORIZED", message)

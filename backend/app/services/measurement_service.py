"""Camera measurement use case: validate the upload, run detection, estimate measurements.

Privacy: photos stay in memory for the duration of the request. They are never written
to disk, stored in the database, logged, or returned.
"""

import asyncio
import time

from fastapi import UploadFile

from ..core.config import get_settings
from ..core.exceptions import ApiError, validation_error
from ..core.security.rate_limit import rate_limiter
from ..cv.detector import ImageDecodeError, get_detector
from ..cv.pipeline import estimate, to_response
from ..cv.quality import build_view
from ..cv.regressor import get_measurement_model
from ..cv.views import VIEW_KEYS, ViewGeometry
from ..models import User
from .catalog import measurement_ranges

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
DISCLAIMER = (
    "These are camera estimates, not tape measurements. Each ± value is the typical error our "
    "model showed on people it had never seen. Errors can be larger with loose clothing, poor "
    "lighting, a busy background or a slouched pose. Confirm critical measurements with a tape measure."
)


async def _read_image(key: str, upload: UploadFile, limit: int) -> bytes:
    if upload.content_type not in ALLOWED_TYPES:
        raise ApiError(415, "UNSUPPORTED_MEDIA_TYPE", f"'{key}' must be a JPEG, PNG or WebP image.")
    data = await upload.read(limit + 1)
    if len(data) > limit:
        raise ApiError(413, "PAYLOAD_TOO_LARGE", f"'{key}' is larger than {limit // (1024 * 1024)} MB.")
    if not data:
        raise validation_error({key: "Image is empty."})
    return data


def _validate_request(height_cm: float, consent: bool, uploads: dict[str, UploadFile]) -> None:
    if not consent:
        raise validation_error({"consent": "Consent is required to analyse your photos."})
    h = measurement_ranges()["height"]
    if not h["minCm"] <= height_cm <= h["maxCm"]:
        raise validation_error({"heightCm": f"Height must be between {h['minCm']} and {h['maxCm']} cm."})
    if not {"front", "back"} & uploads.keys():
        raise validation_error({"front": "A front (or back) view photo is required."})


async def analyze(user: User, height_cm: float, consent: bool, uploads: dict[str, UploadFile | None]) -> dict:
    s = get_settings()
    uploads = {k: u for k, u in uploads.items() if u is not None and u.filename}
    _validate_request(height_cm, consent, uploads)
    model = get_measurement_model()
    if model is None or not s.pose_model_path.exists():
        raise ApiError(503, "MODEL_UNAVAILABLE", "Measurement service is not ready. Please try again later.")
    rate_limiter.check(f"analyze:{user.id}", s.analyze_rate_limit_per_minute)

    started = time.perf_counter()
    images = {k: await _read_image(k, u, s.cv_max_image_bytes) for k, u in uploads.items()}
    detector = get_detector(s.pose_model_path, s.cv_max_workers)
    # All views run in parallel on the shared, bounded worker pool.
    futures = {k: asyncio.wrap_future(detector.submit(data, s.cv_max_image_side)) for k, data in images.items()}
    try:
        detections = dict(zip(futures, await asyncio.gather(*futures.values()), strict=True))
    except ImageDecodeError as exc:
        raise validation_error({"images": str(exc)}) from None
    finally:
        images.clear()

    views: dict[str, ViewGeometry] = {}
    report: dict[str, dict] = {}
    for key in VIEW_KEYS:
        if key not in detections:
            report[key] = {"provided": False, "used": False, "issues": []}
            continue
        built = build_view(key, detections[key], height_cm)
        if isinstance(built, ViewGeometry):
            views[key] = built
            report[key] = {"provided": True, "used": True, "issues": built.issues}
        else:
            report[key] = {"provided": True, "used": False, "issues": built}

    estimates, warnings = estimate(views, height_cm, model)
    ranges = measurement_ranges()
    return {
        "measurements": {k: to_response(k, e, ranges) for k, e in estimates.items()},
        "views": report,
        "warnings": warnings,
        "model": f"{detector.model_name} + {model.version}",
        "processingMs": round((time.perf_counter() - started) * 1000),
        "disclaimer": DISCLAIMER,
    }

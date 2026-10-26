from typing import Annotated

from fastapi import APIRouter, File, Form, UploadFile

from ...schemas import AnalysisOut, Envelope
from ...services import measurement_service
from ..deps import CurrentUser

router = APIRouter(prefix="/measurements", tags=["measurements"])
Image = Annotated[UploadFile | None, File()]


@router.post("/analyze", response_model=Envelope[AnalysisOut])
async def analyze(
    user: CurrentUser,
    height_cm: Annotated[float, Form(alias="heightCm")],
    consent: Annotated[bool, Form()],
    include_bust: Annotated[bool, Form(alias="includeBust")] = False,
    front: Image = None,
    back: Image = None,
    left_side: Annotated[UploadFile | None, File(alias="left-side")] = None,
    right_side: Annotated[UploadFile | None, File(alias="right-side")] = None,
):
    """Estimate body measurements from photos (multipart/form-data).

    `heightCm` (barefoot, required) sets the scale and `consent` must be true. Images are
    `front`, `back`, `left-side` and `right-side`. A front or back view is required; adding a
    side view enables the more accurate model. `includeBust` (opt-in) also estimates the underbust
    for a cup size. Photos are analysed in memory and discarded.
    """
    uploads = {"front": front, "back": back, "left-side": left_side, "right-side": right_side}
    return {"data": await measurement_service.analyze(user, height_cm, consent, uploads, include_bust)}

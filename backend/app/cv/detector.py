"""MediaPipe PoseLandmarker wrapper: one model pass gives 33 landmarks + a person mask.

Performance notes:
- The model file is read once and shared as an in-memory buffer.
- Each worker thread lazily builds its own landmarker (instances are not thread-safe),
  so views of one request run in parallel and models stay warm between requests.
- A bounded pool caps CPU use across all concurrent requests.
"""

import threading
from concurrent.futures import Future, ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks.python import BaseOptions, vision

from .geometry import largest_component

MASK_THRESHOLD = 0.5


class ImageDecodeError(ValueError):
    pass


@dataclass(frozen=True)
class ViewDetection:
    landmarks: np.ndarray  # (33, 4): x_px, y_px, z, visibility
    mask: np.ndarray  # (H, W) bool — largest person blob
    people: int


def decode_image(data: bytes, max_side: int) -> np.ndarray:
    """Bytes -> RGB uint8 array, EXIF-rotated and downscaled so the long side <= max_side."""
    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)  # applies EXIF orientation
    if img is None:
        raise ImageDecodeError("Could not read image. Use JPEG, PNG or WebP.")
    h, w = img.shape[:2]
    scale = max_side / max(h, w)
    if scale < 1:
        img = cv2.resize(img, (round(w * scale), round(h * scale)), interpolation=cv2.INTER_AREA)
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


class PoseDetector:
    def __init__(self, model_path: Path, max_workers: int = 2):
        self._model = Path(model_path).read_bytes()
        self.model_name = Path(model_path).stem
        self._local = threading.local()
        self._instances: list = []
        self._lock = threading.Lock()
        self._pool = ThreadPoolExecutor(max_workers=max_workers, thread_name_prefix="pose")

    def _landmarker(self):
        lm = getattr(self._local, "landmarker", None)
        if lm is None:
            options = vision.PoseLandmarkerOptions(
                base_options=BaseOptions(model_asset_buffer=self._model),
                running_mode=vision.RunningMode.IMAGE,
                num_poses=2,  # lets us warn when someone else is in frame
                min_pose_detection_confidence=0.5,
                min_pose_presence_confidence=0.5,
                output_segmentation_masks=True,
            )
            lm = vision.PoseLandmarker.create_from_options(options)
            self._local.landmarker = lm
            with self._lock:
                self._instances.append(lm)
        return lm

    def _detect(self, data: bytes, max_side: int) -> ViewDetection | None:
        rgb = decode_image(data, max_side)
        h, w = rgb.shape[:2]
        result = self._landmarker().detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
        if not result.pose_landmarks or not result.segmentation_masks:
            return None
        masks = [m.numpy_view().reshape(h, w) > MASK_THRESHOLD for m in result.segmentation_masks]
        best = int(np.argmax([m.sum() for m in masks]))  # most prominent person
        lms = np.array(
            [(p.x * w, p.y * h, p.z, p.visibility or 0.0) for p in result.pose_landmarks[best]],
            dtype=np.float64,
        )
        return ViewDetection(lms, largest_component(masks[best]), len(result.pose_landmarks))

    def submit(self, data: bytes, max_side: int) -> "Future[ViewDetection | None]":
        return self._pool.submit(self._detect, data, max_side)

    def close(self) -> None:
        self._pool.shutdown(wait=True)
        with self._lock:
            for lm in self._instances:
                lm.close()
            self._instances.clear()


_detector: PoseDetector | None = None
_detector_lock = threading.Lock()


def get_detector(model_path: Path, max_workers: int) -> PoseDetector:
    global _detector
    if _detector is None:
        with _detector_lock:
            if _detector is None:
                _detector = PoseDetector(model_path, max_workers)
    return _detector


def shutdown_detector() -> None:
    global _detector
    if _detector is not None:
        _detector.close()
        _detector = None

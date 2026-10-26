"""Garment textures for the web: downsized WebP with a fabric mask in the alpha channel.

The mask marks the garment's main fabric (the dominant colour where the mesh samples the
texture), so the 3D studio can recolour the fabric to the chosen colour while buttons, a
shirt under a jacket or a tie keep their own colours. It is stored as alpha 128–255
(mask = 2·alpha − 1): WebP may drop the colour of fully transparent pixels.
"""

from pathlib import Path

import cv2
import numpy as np

SIZE = 1024
NORMAL_SIZE = 512
WEBP = [cv2.IMWRITE_WEBP_QUALITY, 82]
# Lab distance (OpenCV 8-bit units) from the fabric colour: fully fabric below, not fabric above.
MASK_NEAR, MASK_FAR = 22.0, 46.0


def _srgb_to_linear(c: np.ndarray) -> np.ndarray:
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def _sample(image: np.ndarray, uvs: np.ndarray) -> np.ndarray:
    h, w = image.shape[:2]
    x = np.clip((uvs[:, 0] % 1.0) * (w - 1), 0, w - 1).astype(int)
    y = np.clip((1.0 - uvs[:, 1] % 1.0) * (h - 1), 0, h - 1).astype(int)
    return image[y, x]


def garment_texture(src: Path, uvs: np.ndarray, out: Path, lightest: bool = False) -> dict:
    """Write `out` (RGB + fabric mask) and return the fabric's mean linear luminance. The fabric
    is the dominant colour, or with `lightest` the lightest one (shoes: the socks, not the leather)."""
    bgr = cv2.resize(cv2.imread(str(src), cv2.IMREAD_COLOR), (SIZE, SIZE), interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    samples = _sample(lab, uvs).reshape(-1, 3)
    cv2.setRNGSeed(0)  # k-means++ seeding: same input, same texture
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5)
    _, labels, centres = cv2.kmeans(samples, 3, None, criteria, 4, cv2.KMEANS_PP_CENTERS)
    counts = np.bincount(labels.ravel(), minlength=len(centres))
    if lightest:  # the lightest colour covering at least a tenth of the garment
        fabric = centres[np.argmax(np.where(counts > 0.1 * counts.sum(), centres[:, 0], -1))]
    else:
        fabric = centres[counts.argmax()]

    distance = np.linalg.norm(lab - fabric, axis=2)
    mask = np.clip((MASK_FAR - distance) / (MASK_FAR - MASK_NEAR), 0, 1)
    mask = cv2.GaussianBlur(mask, (5, 5), 0)
    alpha = np.round(128 + mask * 127).astype(np.uint8)
    cv2.imwrite(str(out), np.dstack([bgr, alpha]), WEBP)

    rgb = _srgb_to_linear(_sample(bgr, uvs)[:, ::-1] / 255.0)
    luminance = rgb @ np.array([0.2126, 0.7152, 0.0722])
    in_fabric = _sample(mask, uvs) > 0.5
    return {"texture": out.name, "fabricLuminance": round(float(luminance[in_fabric].mean()), 4),
            "fabricShare": round(float(in_fabric.mean()), 3)}


def plain_texture(src: Path, out: Path, keep_alpha: bool) -> str:
    """A downsized texture as modelled; hair keeps its alpha (strand cut-outs)."""
    image = cv2.imread(str(src), cv2.IMREAD_UNCHANGED if keep_alpha else cv2.IMREAD_COLOR)
    cv2.imwrite(str(out), cv2.resize(image, (SIZE, SIZE), interpolation=cv2.INTER_AREA), WEBP)
    return out.name


def normal_map(src: Path, out: Path) -> str:
    image = cv2.resize(cv2.imread(str(src), cv2.IMREAD_COLOR), (NORMAL_SIZE, NORMAL_SIZE), interpolation=cv2.INTER_AREA)
    cv2.imwrite(str(out), image, WEBP)
    return out.name

"""Garments and accessories (hair, shoes, eyes): .mhclo fitting data plus a render mesh split at
UV seams.

The browser recomputes every vertex from the body it is fitted to, so only the fitting data is
stored, never positions. Texture handling depends on the kind (see sources.ASSETS).
"""

from pathlib import Path

import numpy as np

from .body import BODY_VERTS
from .coverage import covered, erode
from .makehuman import read_mhclo, read_mhmat, read_obj, triangulate
from .pack import Pack, indices, quantize
from .textures import garment_texture, normal_map, plain_texture

WEIGHT_STEP = 1 / 8192
OFFSET_STEP = 1 / 4000
UV_STEP = 1 / 8192


def read_clothes(folder: Path):
    return read_mhclo(folder / f"{folder.name}.mhclo")


def fit_on(clothes, body: np.ndarray) -> np.ndarray:
    """Garment vertices fitted to `body` (the browser's fitGarment, used here for coverage; the
    OBJ's own coordinates aren't always in the body's frame)."""
    scale = np.ones(3)
    for axis, (a, b, den) in clothes.scale.items():
        k = "xyz".index(axis)
        scale[k] = abs(body[a, k] - body[b, k]) / den
    return np.einsum("nk,nkd->nd", clothes.weights, body[clothes.refs]) + clothes.offsets * scale


def _textures(kind: str, garment_id: str, folder: Path, material: dict, uvs: np.ndarray, out_dir: Path) -> dict:
    if kind == "eyes":
        return {"mode": "clay"}
    src = folder / material["diffuseTexture"]
    if kind in ("garment", "shoes"):
        entry = {"mode": "fabric"} | garment_texture(src, uvs, out_dir / f"{garment_id}.webp", lightest=kind == "shoes")
    else:
        entry = {"mode": "cutout" if kind == "hair" else "original",
                 "texture": plain_texture(src, out_dir / f"{garment_id}.webp", keep_alpha=kind == "hair")}
    normal = material.get("normalmapTexture")
    if normal and (folder / normal).exists():
        entry["normalMap"] = normal_map(folder / normal, out_dir / f"{garment_id}-normal.webp")
    return entry


def export_garment(garment_id: str, kind: str, folder: Path, out_dir: Path, remap: np.ndarray, body) -> dict:
    """`remap` turns base-mesh vertex numbers into the exported body's; `body` is the base mesh
    (positions, skin triangles) the garment was modelled on."""
    clothes = read_clothes(folder)
    mesh = read_obj(folder / clothes.obj_file)
    if len(mesh.positions) != len(clothes.refs):
        raise ValueError(f"{folder.name}: {len(mesh.positions)} vertices but {len(clothes.refs)} fitting rows")

    corners: dict[tuple[int, int], int] = {}
    tris, shape = [], []
    for tri in triangulate([f for faces in mesh.groups.values() for f in faces]):
        tris.append([corners.setdefault(c, len(corners)) for c in tri])
        shape.append([c[0] for c in tri])
    # Skin under the garment: its own delete list plus geometric coverage, kept clear of the edges.
    if kind == "eyes":
        hide = np.zeros(0, dtype=np.int64)
    else:
        hits = covered(body[0], body[1], fit_on(clothes, body[0]), np.array(shape))
        hide = erode(np.union1d(np.array(clothes.delete_verts, dtype=np.int64), hits), body[1], len(body[0]))
        hide = hide[hide < BODY_VERTS]  # delete lists can name helper vertices; only skin is drawn
    unique = np.array(list(corners))  # (k, 2): garment vertex, uv index
    uvs = mesh.uvs[unique[:, 1]]

    pack = Pack()
    pack.add("refs", indices(remap[clothes.refs.ravel()]))
    pack.add("weights", quantize(clothes.weights, WEIGHT_STEP), WEIGHT_STEP)
    pack.add("offsets", quantize(clothes.offsets, OFFSET_STEP), OFFSET_STEP)
    pack.add("vertex", indices(unique[:, 0]))
    pack.add("uv", quantize(uvs, UV_STEP), UV_STEP)
    pack.add("index", indices(np.array(tris).ravel()))
    pack.add("hide", indices(remap[hide]))
    entry = pack.save(out_dir / f"{garment_id}.bin")

    material = read_mhmat(folder / clothes.material) if (folder / clothes.material).exists() else {}
    entry |= {"kind": kind} | _textures(kind, garment_id, folder, material, uvs, out_dir)
    return entry | {
        "scale": {axis: [int(remap[a]), int(remap[b]), den] for axis, (a, b, den) in clothes.scale.items()},
        "credit": {"name": clothes.name, "source": folder.name, "author": clothes.meta.get("author", "MakeHuman team"),
                   "license": clothes.meta.get("license", "CC0")},
    }

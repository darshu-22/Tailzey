"""The base body: mesh, morph targets and the landmarks the browser measures it with.

Landmarks are derived from the CC0 mesh and targets themselves:
- each girth is a horizontal slice at the vertex its tape-measure target moves most, except the
  bust (at the breast apex, where the cup-size target moves most) and the neck (at its base,
  MakeHuman's neck joint);
- shoulder tips are where the shoulder-width target pushes outwards most;
- arm and leg lengths run between MakeHuman's joint helpers; the crotch is the lowest
  midline vertex of the torso.
"""

from pathlib import Path

import numpy as np

from .makehuman import Mesh, read_target
from .pack import Pack, indices, quantize
from .sources import ETHNICITIES, MACRO_TARGETS, MEASURE_TARGETS

STEP = 1 / 1000  # decimetres → 0.1 mm, for positions and morph deltas
BODY_VERTS = 13380  # the first 13 380 base-mesh vertices are the skin; the rest are helpers
GIRTH_TARGETS = {"chest": "female-maxcup", "underbust": "underbust-circ-incr", "waist": "waist-circ-incr",
                 "hip": "hips-circ-incr"}
# MakeHuman's "r-" side is the body's right, at −x.
JOINTS = ("ground", "neck", "r-elbow", "l-elbow", "r-hand", "l-hand", "r-knee", "l-knee", "r-ankle", "l-ankle")


def _mix(parts: list[tuple[np.ndarray, np.ndarray]], n: int) -> tuple[np.ndarray, np.ndarray]:
    dense = np.zeros((n, 3))
    for idx, delta in parts:
        dense[idx] += delta / len(parts)
    keep = np.flatnonzero(np.abs(dense).max(axis=1) > 0)
    return keep, dense[keep]


def load_targets(repo: Path, vertex_count: int) -> dict[str, tuple[np.ndarray, np.ndarray]]:
    """Sparse targets by name; 'female' / 'male' are the equal mix of the three ethnic shapes."""
    read = lambda name: read_target(repo / "targets" / f"{name}.target")
    sexes = {sex: _mix([read(f"{sex}-{e}") for e in ETHNICITIES], vertex_count) for sex in ("female", "male")}
    return sexes | {name: read(name) for name in MACRO_TARGETS | MEASURE_TARGETS}


def _strongest(target: tuple[np.ndarray, np.ndarray], axes=(0, 2)) -> int:
    idx, delta = target
    body = idx < BODY_VERTS
    strength = np.linalg.norm(delta[:, list(axes)], axis=1) * body
    return int(idx[np.argmax(strength)])


def landmarks(mesh: Mesh, targets) -> dict:
    p = mesh.positions
    joints = {name: sorted({c[0] for f in mesh.groups[f"joint-{name}"] for c in f}) for name in JOINTS}
    levels = {key: _strongest(targets[t]) for key, t in GIRTH_TARGETS.items()}

    idx, delta = targets["shoulder-dist-incr"]
    outward = np.where((idx < BODY_VERTS) & (p[idx, 0] < 0), -delta[:, 0], 0)
    right = int(idx[np.argmax(outward)])
    left = int(np.argmin(np.linalg.norm(p[:BODY_VERTS] - p[right] * [-1, 1, 1], axis=1)))

    body = p[:BODY_VERTS]
    hip_y = p[levels["hip"], 1]
    midline = np.flatnonzero((np.abs(body[:, 0]) < 1e-4) & (body[:, 1] < hip_y) & (body[:, 1] > hip_y - 3))
    crotch = int(midline[np.argmin(body[midline, 1])])
    return {"joints": joints, "levels": levels, "shoulderTips": [right, left], "crotch": crotch,
            "top": int(np.argmax(body[:, 1]))}


def used_vertices(mesh: Mesh, clothes_refs: list[np.ndarray]) -> np.ndarray:
    """Skin vertices, plus the helpers that joints and garments are fitted to (eyes, teeth… go)."""
    used = set(range(BODY_VERTS))
    for name in JOINTS:
        used.update(c[0] for f in mesh.groups[f"joint-{name}"] for c in f)
    for refs in clothes_refs:
        used.update(int(i) for i in np.unique(refs))
    return np.array(sorted(used))


def _remap_landmarks(lm: dict, remap: np.ndarray) -> dict:
    to = lambda i: int(remap[i])
    return {"joints": {k: [to(i) for i in v] for k, v in lm["joints"].items()},
            "levels": {k: to(i) for k, i in lm["levels"].items()},
            "shoulderTips": [to(i) for i in lm["shoulderTips"]], "crotch": to(lm["crotch"]), "top": to(lm["top"])}


def export_body(mesh: Mesh, targets, keep: np.ndarray, out_dir: Path) -> dict:
    """body.bin (shape, faces, tape-measure morphs) and body-<sex>.bin (that sex's macro morphs)."""
    remap = np.full(len(mesh.positions), -1)
    remap[keep] = np.arange(len(keep))
    sparse = lambda pack, name: pack.add_sparse(name, remap[targets[name][0]], targets[name][1], STEP)

    common = Pack()
    common.add("position", quantize(mesh.positions[keep], STEP), STEP)
    if any(len(f) != 4 for f in mesh.groups["body"]):
        raise ValueError("the browser subdivides the skin as quads; the base mesh changed")
    common.add("quads", indices([remap[c[0]] for f in mesh.groups["body"] for c in f]))
    for name in MEASURE_TARGETS:
        sparse(common, name)
    files = {"common": common.save(out_dir / "body.bin")}
    for sex in ("female", "male"):
        pack = Pack()
        for name in [sex, *(n for n in MACRO_TARGETS if n.startswith(f"{sex}-"))]:
            sparse(pack, name)
        files[sex] = pack.save(out_dir / f"body-{sex}.bin")
    return {"files": files, "vertexCount": len(keep), "bodyVertexCount": BODY_VERTS,
            "landmarks": _remap_landmarks(landmarks(mesh, targets), remap)}

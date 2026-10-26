"""Readers for MakeHuman files: OBJ meshes, .target morphs and .mhclo clothes fitting data.

MakeHuman works in decimetres, y up, facing +z. A clothes vertex is fitted to the body as
Σ wᵢ·body[refᵢ] + offset ⊙ scale, where scale per axis is |body[a] − body[b]| / denominator
(the .mhclo x/y/z_scale lines), so clothes follow any body shape the targets produce.
"""

import re
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np


@dataclass
class Mesh:
    positions: np.ndarray  # (n, 3)
    uvs: np.ndarray  # (m, 2)
    groups: dict[str, list[list[tuple[int, int]]]] = field(default_factory=dict)  # name → faces of (v, vt)


def read_obj(path: Path) -> Mesh:
    positions, uvs, groups = [], [], {}
    current = groups.setdefault("default", [])
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        words = line.split()
        if not words:
            continue
        if words[0] == "v":
            positions.append([float(x) for x in words[1:4]])
        elif words[0] == "vt":
            uvs.append([float(x) for x in words[1:3]])
        elif words[0] == "g":
            current = groups.setdefault(words[1] if len(words) > 1 else "default", [])
        elif words[0] == "f":
            corners = []
            for token in words[1:]:
                parts = token.split("/")
                corners.append((int(parts[0]) - 1, int(parts[1]) - 1 if len(parts) > 1 and parts[1] else -1))
            current.append(corners)
    return Mesh(np.array(positions), np.array(uvs) if uvs else np.zeros((0, 2)), groups)


def triangulate(faces: list[list[tuple[int, int]]]) -> list[tuple[tuple[int, int], ...]]:
    return [(f[0], f[i], f[i + 1]) for f in faces for i in range(1, len(f) - 1)]


def read_target(path: Path) -> tuple[np.ndarray, np.ndarray]:
    """(vertex indices, deltas (k, 3)) of a sparse .target morph."""
    rows = [line.split() for line in path.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.startswith("#")]
    deltas = np.array([[float(x) for x in r[1:4]] for r in rows]).reshape(-1, 3)
    return np.array([int(r[0]) for r in rows], dtype=np.int64), deltas


@dataclass
class Clothes:
    name: str
    obj_file: str
    material: str
    refs: np.ndarray  # (n, 3) body vertex indices
    weights: np.ndarray  # (n, 3)
    offsets: np.ndarray  # (n, 3)
    scale: dict[str, tuple[int, int, float]]  # axis → (vertex a, vertex b, denominator)
    delete_verts: list[int]
    meta: dict[str, str]


def _ranges(words: list[str]) -> list[int]:
    out, i = [], 0
    while i < len(words):
        if i + 2 < len(words) and words[i + 1] == "-":
            out.extend(range(int(words[i]), int(words[i + 2]) + 1))
            i += 3
        else:
            out.append(int(words[i]))
            i += 1
    return out


def read_mhclo(path: Path) -> Clothes:
    meta, scale, refs, weights, offsets, delete = {}, {}, [], [], [], []
    values = {"name": path.stem, "obj_file": "", "material": ""}
    section = None
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        words = line.split()
        if not words:
            continue
        if words[0] == "#":
            if len(words) > 2 and words[1] in ("author", "license", "homepage"):
                meta[words[1]] = " ".join(words[2:])
            continue
        if re.fullmatch(r"-?\d+", words[0]) and section:
            if section == "verts":
                if len(words) == 1:
                    refs.append([int(words[0])] * 3)
                    weights.append([1.0, 0.0, 0.0])
                    offsets.append([0.0, 0.0, 0.0])
                else:
                    refs.append([int(w) for w in words[:3]])
                    weights.append([float(w) for w in words[3:6]])
                    offsets.append([float(w) for w in words[6:9]])
            else:
                delete.extend(_ranges(words))
            continue
        # Other keywords (e.g. a `material` line right after `verts 0`) don't end a data section.
        section = {"verts": "verts", "delete_verts": "delete"}.get(words[0], section)
        if words[0] in ("x_scale", "y_scale", "z_scale"):
            scale[words[0][0]] = (int(words[1]), int(words[2]), float(words[3]))
        elif words[0] in values and len(words) > 1:
            values[words[0]] = " ".join(words[1:])
    return Clothes(values["name"], values["obj_file"], values["material"], np.array(refs), np.array(weights),
                   np.array(offsets), scale, delete, meta)


def read_mhmat(path: Path) -> dict[str, str]:
    out = {}
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        words = line.split()
        if len(words) >= 2 and not words[0].startswith(("#", "//")):
            out[words[0]] = " ".join(words[1:])
    return out

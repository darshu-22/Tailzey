"""Which skin a garment covers, so the studio can leave it out instead of letting it poke through.

Many garments ship without a delete list. A skin vertex counts as covered when a ray along its
outward normal meets the garment within RAY_DM (both on MakeHuman's base mesh, where the
garment was modelled) and not more than DROP_DM below it: a collar below the throat doesn't
cover the throat. The cut-off keeps hands hanging beside trousers visible. erode() then keeps
skin within a few rings of a neckline or hem, where hiding it would open a hole.
"""

import numpy as np

RAY_DM = 0.6
DROP_DM = 0.2
ERODE = 2
CHUNK = 128


def vertex_normals(positions: np.ndarray, tris: np.ndarray) -> np.ndarray:
    a, b, c = (positions[tris[:, k]] for k in range(3))
    face = np.cross(b - a, c - a)
    normals = np.zeros_like(positions)
    for k in range(3):
        np.add.at(normals, tris[:, k], face)
    return normals / np.maximum(np.linalg.norm(normals, axis=1, keepdims=True), 1e-12)


def covered(body: np.ndarray, body_tris: np.ndarray, garment: np.ndarray, garment_tris: np.ndarray) -> np.ndarray:
    """Indices of body vertices whose outward ray hits the garment (Möller–Trumbore, chunked)."""
    normals = vertex_normals(body, body_tris)
    used = np.unique(body_tris)
    lo, hi = garment.min(axis=0) - RAY_DM, garment.max(axis=0) + RAY_DM
    candidates = used[np.all((body[used] >= lo) & (body[used] <= hi), axis=1)]

    v0 = garment[garment_tris[:, 0]].astype(np.float32)
    e1 = (garment[garment_tris[:, 1]] - v0).astype(np.float32)
    e2 = (garment[garment_tris[:, 2]] - v0).astype(np.float32)
    hits = []
    for start in range(0, len(candidates), CHUNK):
        idx = candidates[start : start + CHUNK]
        o = (body[idx] + normals[idx] * 1e-3).astype(np.float32)[:, None, :]
        d = normals[idx].astype(np.float32)[:, None, :]
        p = np.cross(d, e2[None])
        det = np.einsum("ijk,jk->ij", p, e1)
        inv = 1.0 / np.where(np.abs(det) < 1e-9, np.inf, det)
        s = o - v0[None]
        u = np.einsum("ijk,ijk->ij", s, p) * inv
        q = np.cross(s, e1[None])
        v = np.einsum("ijk,ijk->ij", d, q) * inv
        t = np.einsum("ijk,jk->ij", q, e2) * inv
        hit = (u >= 0) & (v >= 0) & (u + v <= 1) & (t > 0) & (t < RAY_DM) & (t * d[:, :, 1] > -DROP_DM)
        hits.append(idx[hit.any(axis=1)])
    return np.concatenate(hits)


def erode(vertices: np.ndarray, tris: np.ndarray, count: int) -> np.ndarray:
    """Drop vertices within ERODE edge rings of any vertex outside the set."""
    inside = np.zeros(count, dtype=bool)
    inside[vertices] = True
    edges = np.concatenate([tris[:, [0, 1]], tris[:, [1, 2]], tris[:, [2, 0]]])
    for _ in range(ERODE):
        outside = ~inside
        lost = np.zeros_like(inside)
        lost[edges[outside[edges[:, 1]], 0]] = True
        lost[edges[outside[edges[:, 0]], 1]] = True
        inside &= ~lost
    return np.flatnonzero(inside)

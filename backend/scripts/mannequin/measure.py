"""Tape measurements of a (morphed) body, in centimetres — the reference for the browser's
src/features/viewer3d/lib/mannequin/measureBody.js, which must give the same numbers.

A girth is the convex hull of the torso's horizontal slice at a landmark, like a tape that
bridges hollows (between the breasts, the small of the back). Slice points are joined through
the mesh edges they lie on into closed loops; the torso is the widest loop across the centre
line (the arms hang apart from it in the A-pose; small loops like the navel are ignored).
"""

import numpy as np

DM_TO_CM = 10.0


def compose(base: np.ndarray, targets, influences: dict[str, float]) -> np.ndarray:
    p = base.copy()
    for name, weight in influences.items():
        if weight:
            idx, delta = targets[name]
            p[idx] += weight * delta
    return p


def _hull_perimeter(points: np.ndarray) -> float:
    pts = sorted(map(tuple, points))
    if len(pts) < 3:
        return 0.0

    def turn(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    def half(seq):
        out = []
        for q in seq:
            while len(out) >= 2 and turn(out[-2], out[-1], q) <= 0:
                out.pop()
            out.append(q)
        return out[:-1]

    hull = np.array(half(pts) + half(pts[::-1]))
    return float(np.linalg.norm(hull - np.roll(hull, 1, axis=0), axis=1).sum())


def slice_loops(p: np.ndarray, tris: np.ndarray, y: float) -> list[np.ndarray]:
    """Closed (x, z) loops where the plane at height y cuts the mesh."""
    points: dict[tuple[int, int], np.ndarray] = {}
    parent: dict[tuple[int, int], tuple[int, int]] = {}

    def root(k):
        while parent[k] != k:
            parent[k] = parent[parent[k]]
            k = parent[k]
        return k

    ys = p[tris, 1]
    for tri in tris[(ys.min(1) <= y) & (ys.max(1) >= y)]:
        keys = []
        for a, b in ((tri[0], tri[1]), (tri[1], tri[2]), (tri[2], tri[0])):
            ya, yb = p[a, 1] - y, p[b, 1] - y
            if ya * yb < 0:
                k = (min(a, b), max(a, b))
                if k not in points:
                    s = ya / (ya - yb)
                    points[k] = (p[a] + s * (p[b] - p[a]))[[0, 2]]
                    parent[k] = k
                keys.append(k)
        if len(keys) == 2:
            parent[root(keys[0])] = root(keys[1])
    loops: dict[tuple[int, int], list[np.ndarray]] = {}
    for k, point in points.items():
        loops.setdefault(root(k), []).append(point)
    return [np.array(v) for v in loops.values()]


def girth(p: np.ndarray, tris: np.ndarray, y: float) -> float:
    across = [loop for loop in slice_loops(p, tris, y) if loop[:, 0].min() < 0 < loop[:, 0].max()]
    torso = max(across, key=lambda loop: np.ptp(loop[:, 0]))
    return _hull_perimeter(torso) * DM_TO_CM


def _centre(p: np.ndarray, verts: list[int]) -> np.ndarray:
    return p[verts].mean(axis=0)


def measure(p: np.ndarray, tris: np.ndarray, lm: dict) -> dict[str, float]:
    j = {name: _centre(p, verts) for name, verts in lm["joints"].items()}
    tips = [p[i] for i in lm["shoulderTips"]]  # right, left
    arms = [np.linalg.norm(tip - j[f"{s}-elbow"]) + np.linalg.norm(j[f"{s}-elbow"] - j[f"{s}-hand"])
            for tip, s in zip(tips, ("r", "l"), strict=True)]
    ankle_y = (j["r-ankle"][1] + j["l-ankle"][1]) / 2
    out = {key: girth(p, tris, p[level, 1]) for key, level in lm["levels"].items()}
    out["neck"] = girth(p, tris, j["neck"][1])
    return out | {
        "height": (p[lm["top"], 1] - j["ground"][1]) * DM_TO_CM,
        "shoulderWidth": float(np.linalg.norm(tips[0] - tips[1])) * DM_TO_CM,
        "armLength": float(np.mean(arms)) * DM_TO_CM,
        "legLength": (p[lm["crotch"], 1] - ankle_y) * DM_TO_CM,
    }

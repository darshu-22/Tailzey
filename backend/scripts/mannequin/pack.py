"""A tiny binary container: typed arrays laid end to end, described by a JSON table.

Positions and deltas are stored as int16 with a per-array scale (value = int × scale), which
halves the size against float32 at a precision far below a millimetre.
"""

from pathlib import Path

import numpy as np

TYPES = {np.dtype("int16"): "Int16", np.dtype("uint16"): "Uint16", np.dtype("uint32"): "Uint32",
         np.dtype("float32"): "Float32"}


def quantize(values: np.ndarray, step: float) -> np.ndarray:
    q = np.round(np.asarray(values) / step)
    if np.abs(q).max(initial=0) > 32767:
        raise ValueError(f"values exceed int16 range at step {step}")
    return q.astype(np.int16)


def indices(values) -> np.ndarray:
    a = np.asarray(values)
    return a.astype(np.uint16 if a.max(initial=0) < 65536 else np.uint32)


class Pack:
    def __init__(self) -> None:
        self.chunks: list[bytes] = []
        self.table: dict[str, dict] = {}
        self.size = 0

    def add(self, name: str, array: np.ndarray, scale: float | None = None) -> None:
        array = np.ascontiguousarray(array)
        data = array.tobytes()
        self.table[name] = {"type": TYPES[array.dtype], "offset": self.size, "length": int(array.size)}
        if scale is not None:
            self.table[name]["scale"] = scale
        pad = (-len(data)) % 4  # keep every array 4-byte aligned for typed-array views
        self.chunks.append(data + b"\0" * pad)
        self.size += len(data) + pad

    def add_sparse(self, name: str, idx: np.ndarray, delta: np.ndarray, step: float) -> None:
        """A sparse morph: vertex indices as ascending gaps (they compress far better) + int16 deltas."""
        keep = (idx >= 0) & (np.abs(delta).max(axis=1, initial=0) >= step / 2)
        order = np.argsort(idx[keep])
        gaps = np.diff(idx[keep][order], prepend=0)
        if gaps.max(initial=0) > 65535:
            raise ValueError(f"{name}: index gap too large for uint16")
        self.add(f"{name}.index", gaps.astype(np.uint16))
        self.add(f"{name}.delta", quantize(delta[keep][order], step), step)

    def save(self, path: Path) -> dict:
        path.write_bytes(b"".join(self.chunks))
        return {"file": path.name, "bytes": self.size, "arrays": self.table}

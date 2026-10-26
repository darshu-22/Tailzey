"""Build the 3D studio's mannequin and garments from MakeHuman's CC0 assets.

Usage (from backend/):
    .venv/Scripts/python scripts/build_mannequin.py [--cache DIR]

Downloads (once, into the cache) the MakeHuman base mesh, morph targets and CC0 clothes
packs, then writes compact binaries, WebP textures and manifest.json to
public/models/mannequin/. The output is committed, so the app never downloads at build time.
"""

import argparse
import json
from pathlib import Path

import numpy as np
from mannequin.body import export_body, landmarks, load_targets, used_vertices
from mannequin.garments import export_garment, read_clothes
from mannequin.makehuman import read_obj, triangulate
from mannequin.measure import compose, measure
from mannequin.sources import ASSETS, MAKEHUMAN_COMMIT, fetch_all

BACKEND = Path(__file__).resolve().parents[1]
OUT = BACKEND.parent / "public" / "models" / "mannequin"
CREDITS = ("Body, morph targets and garments: MakeHuman (makehumancommunity.org), released as CC0 1.0. "
           f"Base mesh and targets from makehuman@{MAKEHUMAN_COMMIT[:7]}; garments from the CC0 asset packs.")


def report(mesh, targets) -> None:
    """Print each base body's tape measurements so a broken export is obvious."""
    lm = landmarks(mesh, targets)
    tris = np.array([[c[0] for c in t] for t in triangulate(mesh.groups["body"])])
    for sex in ("female", "male"):
        body = compose(mesh.positions, targets, {sex: 1.0})
        values = measure(body, tris, lm)
        print(f"  {sex}: " + ", ".join(f"{k} {v:.1f}" for k, v in values.items()))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--cache", type=Path, default=BACKEND / ".cache" / "mannequin")
    args = parser.parse_args()

    src = fetch_all(args.cache)
    OUT.mkdir(parents=True, exist_ok=True)
    mesh = read_obj(src["repo"] / "base.obj")
    targets = load_targets(src["repo"], len(mesh.positions))
    report(mesh, targets)

    clothes = {gid: read_clothes(src["packs"] / folder) for gid, (_, folder) in ASSETS.items()}
    scale_refs = [np.array([v[:2] for v in c.scale.values()]) for c in clothes.values()]
    keep = used_vertices(mesh, [c.refs for c in clothes.values()] + scale_refs)
    remap = np.full(len(mesh.positions), -1)
    remap[keep] = np.arange(len(keep))
    body = export_body(mesh, targets, keep, OUT)
    for name, f in body["files"].items():
        print(f"body {name}: {f['bytes'] / 1024:.0f} KB")

    skin = (mesh.positions, np.array([[c[0] for c in t] for t in triangulate(mesh.groups["body"])]))
    garments = {}
    for garment_id, (kind, folder) in ASSETS.items():
        entry = garments[garment_id] = export_garment(garment_id, kind, src["packs"] / folder, OUT, remap, skin)
        files = [entry["file"], *(entry[k] for k in ("texture", "normalMap") if k in entry)]
        size = sum((OUT / f).stat().st_size for f in files) / 1024
        print(f"{garment_id} ({kind}): {size:.0f} KB, hides {entry['arrays']['hide']['length']} skin vertices")

    manifest = {"version": 1, "units": "dm", "credits": CREDITS, "body": body, "garments": garments}
    (OUT / "manifest.json").write_text(json.dumps(manifest, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()

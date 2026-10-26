"""Where the mannequin's CC0 assets come from, and which of them Tailzey uses.

Base mesh and targets come from the MakeHuman repository (pinned commit); garments come from
the official CC0 asset packs. Every garment below is CC0 (stated in its .mhclo, or part of
the CC0 system pack).
"""

import urllib.request
import zipfile
from pathlib import Path

MAKEHUMAN_COMMIT = "a8bc2d54ff0ac92e78ff71431b1023eda42bf482"
MAKEHUMAN_DATA = f"https://raw.githubusercontent.com/makehumancommunity/makehuman/{MAKEHUMAN_COMMIT}/makehuman/data"
PACKS = "https://files.makehumancommunity.org/asset_packs"
PACK_NAMES = ("makehuman_system_assets", "shirts01", "pants01", "suits01")

# Morph targets. Sex comes from the ethnic macros, mixed equally as MakeHuman does by default;
# then weight (at average and at maximum muscle tone), height, ideal proportions and breast size
# per sex, and the tape-measure modifiers.
ETHNICITIES = ("african", "asian", "caucasian")
SEX_TARGETS = {f"{sex}-{e}": f"macrodetails/{e}-{sex}-young" for sex in ("female", "male") for e in ETHNICITIES}
MACRO_TARGETS = {
    f"{sex}-{w}weight": f"macrodetails/universal-{sex}-young-averagemuscle-{w}weight"
    for sex in ("female", "male") for w in ("min", "average", "max")
} | {
    f"{sex}-maxmuscle-{w}weight": f"macrodetails/universal-{sex}-young-maxmuscle-{w}weight"
    for sex in ("female", "male") for w in ("min", "average", "max")
} | {
    f"{sex}-idealproportions": f"macrodetails/proportions/{sex}-young-averagemuscle-averageweight-idealproportions"
    for sex in ("female", "male")
} | {
    f"{sex}-{h}height": f"macrodetails/height/{sex}-young-averagemuscle-averageweight-{h}height"
    for sex in ("female", "male") for h in ("min", "max")
} | {
    f"female-{c}cup": f"breast/female-young-averagemuscle-averageweight-{c}cup-averagefirmness"
    for c in ("min", "max")
}
MEASURE_MODIFIERS = ("neck-circ", "bust-circ", "underbust-circ", "waist-circ", "hips-circ", "shoulder-dist",
                     "upperarm-length", "lowerarm-length", "upperleg-height", "lowerleg-height")
MEASURE_TARGETS = {f"{m}-{d}": f"measure/measure-{m}-{d}" for m in MEASURE_MODIFIERS for d in ("decr", "incr")}

# Mannequin asset id → (kind, folder inside the extracted packs). Kinds decide the texture:
# garment = recolourable main fabric, shoes = recolourable socks, hair = alpha-cut strands,
# eyes = untextured clay.
ASSETS = {
    "tshirt": ("garment", "clothes/toigo_basic_tucked_t-shirt"),
    "polo": ("garment", "clothes/namuhekam_male_polo_shirt"),
    "suit-male": ("garment", "clothes/toigo_male_suit_3"),
    "suit-female": ("garment", "clothes/toigo_female_suit"),
    "trousers": ("garment", "clothes/toigo_wool_pants"),
    "hair-female": ("hair", "hair/ponytail01"),
    "hair-male": ("hair", "hair/short04"),
    "shoes": ("shoes", "clothes/shoes04"),
    "eyes": ("eyes", "eyes/high-poly"),
}


def _fetch(url: str, target: Path) -> Path:
    if not target.exists():
        target.parent.mkdir(parents=True, exist_ok=True)
        print(f"Downloading {url}")
        tmp = target.with_suffix(target.suffix + ".part")
        urllib.request.urlretrieve(url, tmp)
        tmp.replace(target)
    return target


def fetch_all(cache: Path) -> dict[str, Path]:
    """Download (once) and extract everything; returns the folders the build reads from."""
    repo = cache / "makehuman"
    _fetch(f"{MAKEHUMAN_DATA}/3dobjs/base.obj", repo / "base.obj")
    for name, path in (SEX_TARGETS | MACRO_TARGETS | MEASURE_TARGETS).items():
        _fetch(f"{MAKEHUMAN_DATA}/targets/{path}.target", repo / "targets" / f"{name}.target")
    packs = cache / "packs"
    for pack in PACK_NAMES:
        archive = _fetch(f"{PACKS}/{pack}/{pack}_cc0.zip", cache / "zips" / f"{pack}.zip")
        marker = packs / f".{pack}"
        if not marker.exists():
            with zipfile.ZipFile(archive) as z:
                z.extractall(packs)
            marker.touch()
    return {"repo": repo, "packs": packs}

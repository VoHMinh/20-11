"""Keep all glyphs and shaping tables; instantiate only the weights in use."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path("artifacts/font-tooling").resolve()))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

source = Path("artifacts/font-originals")
target = Path("src/app/fonts")
target.mkdir(exist_ok=True)
for name, weight in [
    ("nunito", 400), ("nunito", 600), ("nunito", 700), ("nunito", 800),
    ("patrick-hand", 400), ("cormorant-garamond", 500),
    ("cormorant-garamond-italic", 500),
]:
    font = TTFont(source / f"{name}.ttf")
    if "fvar" in font:
        font = instantiateVariableFont(font, {"wght": weight}, inplace=True)
    font.flavor = "woff2"
    destination = target / f"{name}-{weight}.woff2"
    font.save(destination)
    print(f"{destination}: {destination.stat().st_size} bytes")
for license in source.glob("*OFL.txt"):
    (target / license.name).write_bytes(license.read_bytes())

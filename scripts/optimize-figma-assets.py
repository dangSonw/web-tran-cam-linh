"""Create delivery WebP files while retaining the original Figma node provenance."""

import argparse
import json
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image


def optimize(page):
    root = Path(__file__).resolve().parents[1]
    image_root = root / "public" / "images" / page
    data_path = root / "src" / "data" / f"{page}Content.js"
    content = data_path.read_text(encoding="utf-8")
    before = 0
    after = 0
    converted = []
    for source in sorted([*image_root.glob("*.png"), *image_root.glob("*.webp")]):
        if "certificate" in source.name or "sign" in source.name:
            continue
        size = source.stat().st_size
        if size < 250000:
            continue
        destination = source.with_suffix(".webp")
        temporary = destination.with_name(f"{destination.stem}.optimized.webp")
        assert destination.resolve().is_relative_to(root)
        with Image.open(source) as image:
            origin = str(image.info.get("Description", image.info.get("parameters", "")))
            if not origin:
                origin = f"Original individual Figma node export from file 9yn92xRnvfIDmo0eurW1Ow; source filename {source.name}; see design/{page}-frame-map.md"
            xmp = (
                '<x:xmpmeta xmlns:x="adobe:ns:meta/">'
                '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
                '<rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/">'
                f'<dc:description>{escape(origin)}</dc:description>'
                '</rdf:Description></rdf:RDF></x:xmpmeta>'
            ).encode("utf-8")
            has_alpha = image.mode == "RGBA" and image.getextrema()[3][0] < 255
            delivery = image.convert("RGBA" if has_alpha else "RGB")
            delivery.save(temporary, "WEBP", quality=90, method=6, lossless=False, xmp=image.info.get("xmp", xmp))
        if temporary.stat().st_size >= size * 0.92:
            temporary.unlink()
            continue
        temporary.replace(destination)
        before += size
        after += destination.stat().st_size
        content = content.replace(source.name, destination.name)
        converted.append({"source": source.name, "delivery": destination.name, "before": size, "after": destination.stat().st_size})
        if source != destination:
            source.unlink()
    data_path.write_text(content, encoding="utf-8", newline="\n")
    return {"page": page, "before": before, "after": after, "saved": before - after, "converted": converted}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("page", choices=["arts", "environment", "others"])
    arguments = parser.parse_args()
    print(json.dumps(optimize(arguments.page), ensure_ascii=False, indent=2))

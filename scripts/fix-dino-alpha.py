#!/usr/bin/env python3
"""
Remove baked-in checkerboard from DALL-E / export PNGs (light OR dark grid).
"""
from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image

CHECKER_DIR = Path(__file__).resolve().parents[1] / "public/assets/images/dino"


def saturation(r: int, g: int, b: int) -> float:
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == 0:
        return 0.0
    return (mx - mn) / mx


def is_checkerboard_pixel(r: int, g: int, b: int, a: int) -> bool:
    """Light gray/white OR dark gray checker cells (not character colors)."""
    if a < 8:
        return True

    s = saturation(r, g, b)
    if s > 0.18:
        return False

    mx, mn = max(r, g, b), min(r, g, b)

    # Light checker: #ccc / #fff
    if mn >= 160:
        return True

    # Dark checker: #363636, #555, etc.
    if mx <= 140 and 20 <= mn <= 115:
        return True

    return False


def remove_fake_background(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    visited = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[y][x]:
            r, g, b, a = px[x, y]
            if is_checkerboard_pixel(r, g, b, a):
                visited[y][x] = True
                queue.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while queue:
        x, y = queue.popleft()
        r, g, b, _a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            push(nx, ny)

    return rgba


def process_file(path: Path, in_place: bool) -> None:
    out = path if in_place else path.with_name(path.stem + ".fixed.png")
    fixed = remove_fake_background(Image.open(path))
    fixed.save(out, "PNG")
    print(f"{'Updated' if in_place else 'Wrote'} {out}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--in-place", action="store_true")
    parser.add_argument("files", nargs="*", type=Path)
    args = parser.parse_args()

    files = args.files or sorted(CHECKER_DIR.glob("dino-*.png"))
    for f in files:
        if f.is_file() and f.suffix.lower() == ".png":
            process_file(f, args.in_place)


if __name__ == "__main__":
    main()

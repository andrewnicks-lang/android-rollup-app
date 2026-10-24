#!/usr/bin/env python3
"""Generate crisp 192x192 and 512x512 RGBA PNG app icons for Android WebAPK & Native APK."""

import math
import struct
import zlib
from pathlib import Path


def write_png(path: Path, width: int, height: int, rgba_bytes: bytes) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack("!I", len(data))
            + tag
            + data
            + struct.pack("!I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    raw_rows = bytearray()
    stride = width * 4
    for y in range(height):
        raw_rows.append(0)  # Filter type 0 (None)
        raw_rows.extend(rgba_bytes[y * stride : (y + 1) * stride])

    ihdr = struct.pack("!IIBBBBB", width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_rows), level=9)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)


def inside_round_rect(x: float, y: float, x0: float, y0: float, w: float, h: float, r: float) -> bool:
    if x < x0 or x > x0 + w or y < y0 or y > y0 + h:
        return False
    cx = min(max(x, x0 + r), x0 + w - r)
    cy = min(max(y, y0 + r), y0 + h - r)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2


def render_rollup_icon(size: int) -> bytes:
    buf = bytearray(size * size * 4)
    s = size / 512.0

    for py in range(size):
        for px in range(size):
            idx = (py * size + px) * 4
            # Outer rounded app icon mask
            if not inside_round_rect(px, py, 0, 0, size - 1, size - 1, 108 * s):
                buf[idx : idx + 4] = b"\x00\x00\x00\x00"
                continue

            # Dark navy gradient background
            t = (px + py) / (2.0 * size)
            r = int(7 * (1 - t) + 26 * t)
            g = int(11 * (1 - t) + 52 * t)
            b = int(20 * (1 - t) + 125 * t)

            # Top-left tile (#38bdf8 sky blue)
            if inside_round_rect(px, py, 92 * s, 92 * s, 140 * s, 140 * s, 32 * s):
                r, g, b = 56, 189, 248
            # Top-right tile (#4ade80 emerald green)
            elif inside_round_rect(px, py, 280 * s, 92 * s, 140 * s, 140 * s, 32 * s):
                r, g, b = 74, 222, 128
            # Bottom-left tile (#c084fc purple)
            elif inside_round_rect(px, py, 92 * s, 280 * s, 140 * s, 140 * s, 32 * s):
                r, g, b = 192, 132, 252
            # Bottom-right dynamic hub ring + amber core
            else:
                cx, cy = 350 * s, 350 * s
                dist = math.hypot(px - cx, py - cy)
                if dist <= 30 * s:
                    r, g, b = 251, 191, 36
                elif 52 * s <= dist <= 70 * s:
                    r, g, b = 56, 189, 248

            buf[idx] = r
            buf[idx + 1] = g
            buf[idx + 2] = b
            buf[idx + 3] = 255

    return bytes(buf)


if __name__ == "__main__":
    assets = Path(__file__).resolve().parent.parent / "assets"
    write_png(assets / "icon-192.png", 192, 192, render_rollup_icon(192))
    write_png(assets / "icon-512.png", 512, 512, render_rollup_icon(512))
    print("Generated icon-192.png and icon-512.png")

#!/usr/bin/env python3
"""
Turns the hand-drawn source animations into small, brand-colored loops for the site.

    python3 scripts/encode-illustrations.py            # all slots
    python3 scripts/encode-illustrations.py hero faq   # some slots

Needs ffmpeg (built with libvpx, libx264, libwebp) and numpy. Set FFMPEG=/path/to/ffmpeg to use another binary.

Per slot, from design/illustrations/<source>.webm (VP9 with alpha, 1200×1200):
  1. crop to the drawing's bounding box over all frames, scale down, flatten onto white;
  2. recolor the orange watercolor to the brand pink (only colored pixels: the black ink and white paper stay put);
  3. write <slot>.mp4 (H.264 — smaller than AV1 here, and plays everywhere) and <slot>.webp (a still for
     reduced motion / blocked autoplay) into src/assets/illustrations/.
The page drops the white with mix-blend-mode (see src/components/illustration.tsx), so no alpha channel is needed.
"""

import os
import re
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "design", "illustrations")
OUT = os.path.join(ROOT, "src", "assets", "illustrations")
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")

# slot → (unique part of the source file name, longest side in px)
SLOTS = {
    "hero": ("globe-symbol-as-global-connection", 800),
    "privacy": ("fingerprint-authentication", 520),
    "support": ("telephone-receiver", 520),
    "devices": ("laptop-with-desk-lamp", 520),
    "step-1": ("discount-vouchers", 520),
    "step-2": ("social-media-browsing", 520),
    "step-3": ("innovation-rocket", 520),
    "faq": ("decision-making-process", 640),
    "cta": ("winner-sitting-inside-trophy", 640),
    "legal": ("document-storage-box", 520),
}

# The source wash sits at hue ≈ 14.5° (coral); --brand (#cf2677) is at 331°.
HUE_SHIFT = 331.0 - 14.5
SAT_GAIN = 1.2  # a touch more pigment…
DARKEN = 0.25  # …and darker in proportion to it, so the wash reads as brand pink rather than bubblegum
FPS = 30


def run(args, **kw):
    return subprocess.run([FFMPEG, "-hide_banner", "-v", "error", *args], check=True, **kw)


def source_for(key):
    matches = [f for f in os.listdir(SRC) if key in f and f.endswith(".webm") and "(1)" not in f]
    if len(matches) != 1:
        sys.exit(f"expected one source matching {key!r} in {SRC}, found {matches}")
    return os.path.join(SRC, matches[0])


def bounding_box(path, pad=0.03):
    """Union of the drawing's alpha bounding boxes over all frames, padded a little."""
    log = subprocess.run(
        [FFMPEG, "-hide_banner", "-c:v", "libvpx-vp9", "-i", path, "-vf", "alphaextract,bbox=min_val=10", "-f", "null", "-"],
        capture_output=True,
        text=True,
        check=True,
    ).stderr
    boxes = [tuple(map(int, m)) for m in re.findall(r"x1:(\d+) x2:(\d+) y1:(\d+) y2:(\d+)", log)]
    x1, x2 = min(b[0] for b in boxes), max(b[1] for b in boxes)
    y1, y2 = min(b[2] for b in boxes), max(b[3] for b in boxes)
    p = round(max(x2 - x1, y2 - y1) * pad)
    return max(0, x1 - p), max(0, y1 - p), min(1200, x2 + p + 1), min(1200, y2 + p + 1)


def recolor(rgb):
    """Rotate the hue of colored pixels to the brand and deepen them; grays (ink, paper) are untouched."""
    c = rgb.astype(np.float32) / 255
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    v = c.max(-1)
    d = v - c.min(-1)
    s = np.where(v > 0, d / np.maximum(v, 1e-6), 0)
    safe = np.maximum(d, 1e-6)
    h = np.where(v == r, ((g - b) / safe) % 6, np.where(v == g, (b - r) / safe + 2, (r - g) / safe + 4)) / 6
    h = (h + HUE_SHIFT / 360) % 1
    s2 = np.clip(s * SAT_GAIN, 0, 1)
    v2 = np.clip(v - DARKEN * s, 0, 1)
    # hsv → rgb
    i = np.floor(h * 6).astype(np.int32) % 6
    f = h * 6 - np.floor(h * 6)
    p, q, t = v2 * (1 - s2), v2 * (1 - f * s2), v2 * (1 - (1 - f) * s2)
    out = np.choose(i[..., None], [
        np.stack([v2, t, p], -1), np.stack([q, v2, p], -1), np.stack([p, v2, t], -1),
        np.stack([p, q, v2], -1), np.stack([t, p, v2], -1), np.stack([v2, p, q], -1),
    ])
    return (out * 255 + 0.5).astype(np.uint8)


def encode(slot):
    key, size = SLOTS[slot]
    src = source_for(key)
    x1, y1, x2, y2 = bounding_box(src)
    w, h = x2 - x1, y2 - y1
    scale = size / max(w, h)
    ow, oh = round(w * scale / 2) * 2, round(h * scale / 2) * 2

    decode = subprocess.Popen(
        [FFMPEG, "-hide_banner", "-v", "error", "-c:v", "libvpx-vp9", "-i", src, "-filter_complex",
         f"color=white:s={ow}x{oh}:r={FPS}[bg];"
         f"[0:v]format=rgba,crop={w}:{h}:{x1}:{y1},scale={ow}:{oh}:flags=lanczos[fg];"
         f"[bg][fg]overlay=shortest=1,format=rgb24",
         "-f", "rawvideo", "-"],
        stdout=subprocess.PIPE,
    )
    frames = []
    frame_bytes = ow * oh * 3
    while chunk := decode.stdout.read(frame_bytes):
        frames.append(recolor(np.frombuffer(chunk, np.uint8).reshape(oh, ow, 3)))
    decode.wait()
    raw = b"".join(f.tobytes() for f in frames)

    rawin = ["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{ow}x{oh}", "-r", str(FPS), "-i", "-"]
    # Near-white luma gets a little "superwhite" headroom: after compression the paper must still decode to 255,
    # or mix-blend-mode would leave a faint gray box around the drawing.
    yuv = ["-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,lutyuv=y='if(gt(val,228),val+8,val)'",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-an"]
    base = os.path.join(OUT, slot)
    run([*rawin, *yuv, "-c:v", "libx264", "-preset", "veryslow", "-crf", "27", "-tune", "animation",
         "-profile:v", "high", "-movflags", "+faststart", "-y", base + ".mp4"], input=raw)
    # the still: the frame where the most is drawn (some loops start nearly empty)
    best = max(range(len(frames)), key=lambda n: int((frames[n] < 200).sum()))
    run(["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{ow}x{oh}", "-i", "-", "-c:v", "libwebp", "-quality", "75",
         "-y", base + ".webp"], input=frames[best].tobytes())

    kb = lambda ext: os.path.getsize(base + ext) / 1024
    print(f"{slot:8} {ow}x{oh} {len(frames):3}f  mp4 {kb('.mp4'):4.0f} KB  webp {kb('.webp'):3.0f} KB")


if __name__ == "__main__":
    for slot in sys.argv[1:] or SLOTS:
        encode(slot)

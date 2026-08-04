"""
generate_favicons.py
Draws real PNG favicons for Guuleed Maxmuud Aw Abdi's cybersecurity portfolio.
Runs with Pillow. The design: dark slate rounded rect + glowing cyan/emerald shield + >_ terminal prompt.
"""

import struct, zlib, math, os
from PIL import Image, ImageDraw

PUBLIC = os.path.join(os.path.dirname(__file__), '..', 'public')

# ---------- colour palette ----------
BG       = (11,  15,  25,  255)   # #0b0f19 – deep space navy
BORDER   = (6,  182, 212,  255)   # #06b6d4 – cyan glow
SHIELD_F = (15,  23,  42,  240)   # #0f172a – dark slate shield fill
SHIELD_B = (16, 185, 129,  255)   # #10b981 – emerald shield border
CYAN     = (34, 211, 238,  255)   # #22d3ee – terminal chevron
GREEN    = (52, 211, 153,  255)   # #34d399 – terminal underscore


def draw_icon(size: int) -> Image.Image:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # — background rounded rectangle —
    m  = max(1, size // 28)                 # margin
    r  = size // 4                          # corner radius
    draw.rounded_rectangle(
        [m, m, size - m, size - m],
        radius=r,
        fill=BG,
        outline=BORDER,
        width=max(1, size // 32),
    )

    # — shield polygon —
    cx   = size // 2
    top  = int(size * 0.19)
    ktop = int(size * 0.27)   # top corners of shield
    mid  = int(size * 0.58)   # widest point / shoulder
    bot  = int(size * 0.86)   # bottom tip
    lx   = int(size * 0.22)
    rx   = int(size * 0.78)
    shield = [(cx, top), (rx, ktop), (rx, mid), (cx, bot), (lx, mid), (lx, ktop)]
    draw.polygon(shield, fill=SHIELD_F, outline=SHIELD_B, width=max(1, size // 40))

    # — terminal >_ symbol —
    stroke = max(1, size // 20)
    # chevron >
    c_left  = int(size * 0.33)
    c_mid   = int(size * 0.47)
    c_top   = int(size * 0.38)
    c_ctr   = int(size * 0.49)
    c_bot   = int(size * 0.60)
    draw.line([(c_left, c_top), (c_mid, c_ctr)], fill=CYAN, width=stroke)
    draw.line([(c_mid,  c_ctr), (c_left, c_bot)], fill=CYAN, width=stroke)
    # underscore _
    u_x1 = int(size * 0.54)
    u_x2 = int(size * 0.69)
    u_y  = int(size * 0.60)
    draw.line([(u_x1, u_y), (u_x2, u_y)], fill=GREEN, width=stroke)

    return img


# ── generate all sizes ──────────────────────────────────────────────────────
sizes = {
    'favicon-16x16.png':        16,
    'favicon-32x32.png':        32,
    'apple-touch-icon.png':    180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
}

for filename, px in sizes.items():
    img = draw_icon(px)
    out = os.path.join(PUBLIC, filename)
    img.save(out, format='PNG', optimize=True)
    print(f'  [OK] saved {filename} ({px}x{px})')

# ── favicon.ico  (multi-res: 16 + 32 + 48) ──────────────────────────────────
ico_sizes = [16, 32, 48]
ico_images = [draw_icon(s).convert('RGBA') for s in ico_sizes]
ico_path = os.path.join(PUBLIC, 'favicon.ico')
ico_images[0].save(
    ico_path,
    format='ICO',
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
)
print(f'  [OK] saved favicon.ico (16/32/48px multi-res)')

print('\n[DONE] All favicon assets generated successfully!')

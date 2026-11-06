"""Generate the site's favicon family from one simple, high-contrast mark."""

import os
from PIL import Image, ImageDraw

PUBLIC = os.path.join(os.path.dirname(__file__), '..', 'public')
SCALE = 4
BG = (8, 169, 154, 255)  # #08a99a
WHITE = (255, 255, 255, 255)


def draw_icon(size: int) -> Image.Image:
    """Draw a clean G monogram, then downsample for crisp small-size edges."""
    px = 512 * SCALE
    im = Image.new('RGBA', (px, px), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    s = SCALE
    d.rounded_rectangle((16*s, 16*s, 496*s, 496*s), radius=128*s, fill=BG)

    # A circular G with a short, centered crossbar. Masking the ring's right
    # middle makes the letterform consistent across raster and SVG renderers.
    width = max(1, round(size * 0.102)) * s
    d.ellipse((106*s, 106*s, 406*s, 406*s), outline=WHITE, width=width)
    d.rectangle((368*s, 184*s, 430*s, 328*s), fill=BG)
    d.line((368*s, 256*s, 240*s, 256*s), fill=WHITE, width=width)
    # Round the crossbar's inner end to match the SVG stroke styling.
    radius = width // 2
    d.ellipse((240*s-radius, 256*s-radius, 240*s+radius, 256*s+radius), fill=WHITE)

    return im.resize((size, size), Image.Resampling.LANCZOS)


sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
}

for filename, px in sizes.items():
    draw_icon(px).save(os.path.join(PUBLIC, filename), format='PNG', optimize=True)
    print(f'  [OK] saved {filename} ({px}x{px})')

ico_sizes = [16, 32, 48]
ico_images = [draw_icon(s).convert('RGBA') for s in ico_sizes]
ico_images[0].save(
    os.path.join(PUBLIC, 'favicon.ico'),
    format='ICO',
    sizes=[(s, s) for s in ico_sizes],
    append_images=ico_images[1:],
)
print('  [OK] saved favicon.ico (16/32/48px multi-res)')

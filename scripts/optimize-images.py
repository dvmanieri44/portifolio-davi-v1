"""Encode responsive portraits and a social sharing card from the original photo."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent
source = Image.open(root / 'img/davi-portrait.png').convert('RGBA')
for size in [480, 960]:
    output = source.resize((size, size), Image.Resampling.LANCZOS)
    target = root / f'img/davi-portrait-{size}.webp'
    output.save(target, 'WEBP', quality=84, method=6)
    print(target.name, target.stat().st_size)

card = Image.new('RGB', (1200, 630), '#0c1c38')
draw = ImageDraw.Draw(card)
font_dir = Path('C:/Windows/Fonts')
title = ImageFont.truetype(str(font_dir / 'segoeuib.ttf'), 75)
subtitle = ImageFont.truetype(str(font_dir / 'segoeui.ttf'), 32)
small = ImageFont.truetype(str(font_dir / 'segoeui.ttf'), 23)
portrait = source.resize((610, 610), Image.Resampling.LANCZOS)
card.paste(portrait, (610, 20), portrait)
draw.text((65, 170), 'Davi', fill='#fcfcfa', font=title)
draw.text((65, 250), 'Manieri.', fill='#fcfcfa', font=title)
draw.text((70, 365), 'Software Engineer', fill='#b8ceee', font=subtitle)
draw.text((70, 425), 'Android / Full-stack / Applied AI', fill='#b8ceee', font=small)
draw.line((70, 510, 540, 510), fill='#315789', width=2)
card.save(root / 'img/social-card.jpg', quality=88, optimize=True)

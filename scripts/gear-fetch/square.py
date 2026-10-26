# Trims the white margin off a product photo, centres it on a white square with even padding, saves 160px JPEG.
# python3 -I square.py in.jpg out.jpg
import sys
from PIL import Image, ImageChops

im = Image.open(sys.argv[1]).convert("RGB")
bg = Image.new("RGB", im.size, (255, 255, 255))
box = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 18 else 0).getbbox()
if box:
    im = im.crop(box)
side = int(max(im.size) * 1.12)
sq = Image.new("RGB", (side, side), (255, 255, 255))
sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
sq.resize((160, 160), Image.LANCZOS).save(sys.argv[2], "JPEG", quality=86, optimize=True, progressive=True)

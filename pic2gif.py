import os
from PIL import Image
import hashlib
import shutil


def convert_to_static_gif_and_delete(src_file):
    try:
        with Image.open(src_file) as img:
            # Ensure image is in a GIF-compatible mode
            # Convert to GIF-compatible mode if necessary
            if img.mode != 'RGB' and img.mode != 'L':
                img = img.convert('RGB')
            # Limit size to 1024x1024 while maintaining aspect ratio
            max_size = (1024, 1024)
            if img.width > 1024 or img.height > 1024:
                img.thumbnail(max_size, Image.LANCZOS)
            # get image hash to avoid duplicate conversion and as file name
            image_hash = hashlib.sha256(img.tobytes()).hexdigest()
            gif_filename = image_hash + '.gif'
            gif_filepath = os.path.join('converted', gif_filename)
            if (os.path.exists(gif_filepath)):
                print(
                    f"Skipping {src_file} because {gif_filepath} already exists")
                os.remove(src_file)
                return
            img.save(gif_filepath, 'GIF')
            # rename src_file to hash + original extension
            original_filename = image_hash + os.path.splitext(src_file)[-1]
            shutil.move(src_file, os.path.join('original', original_filename))

        print(
            f"Converted {src_file} -> {gif_filepath}")
    except Exception as e:
        print(f"Failed on {src_file}: {e}")


# check if dir "original" exists, if not create it
if not os.path.exists('original'):
    os.makedirs('original')
if not os.path.exists('converted'):
    os.makedirs('converted')

supported_exts = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}

for fname in os.listdir('.'):
    fpath = os.path.join('.', fname)
    if not os.path.isfile(fpath):
        continue
    root, ext = os.path.splitext(fname)
    if ext.lower() in supported_exts:
        convert_to_static_gif_and_delete(fname)

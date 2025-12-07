#!/usr/bin/env python3
"""
Simple script to generate placeholder icons for the LinkedIn Comments Counter extension.
Requires: PIL (Pillow)
Install with: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Error: Pillow is not installed.")
    print("Please install it with: pip install Pillow")
    exit(1)

# Icon sizes
SIZES = [16, 48, 128]

# Colors (purple gradient theme)
BACKGROUND_COLOR = (138, 43, 226)  # Purple
EMOJI = "💬"

def create_icon(size, filename):
    """Create a simple icon with a gradient background and emoji"""

    # Create image with gradient
    img = Image.new('RGB', (size, size), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)

    # Create a simple circle
    margin = size // 10
    draw.ellipse([margin, margin, size-margin, size-margin],
                 fill=(219, 112, 147))  # Pink

    # Try to add emoji/text
    try:
        # For larger icons, try to add the emoji or text
        if size >= 48:
            font_size = size // 2
            # Fallback to text if emoji doesn't work
            text = "💬"
            draw.text((size//2, size//2), text, anchor="mm",
                     fill=(255, 255, 255))
    except Exception as e:
        # If font/emoji fails, just use the circle
        pass

    # Save with anti-aliasing
    img.save(filename, 'PNG')
    print(f"Created: {filename}")

def main():
    # Create icons directory if it doesn't exist
    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)

    # Generate icons
    for size in SIZES:
        filename = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, filename)

    print("\n✅ All icons created successfully!")
    print("You can now load the extension in Chrome.")

if __name__ == '__main__':
    main()

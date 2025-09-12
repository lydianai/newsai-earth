#!/usr/bin/env python3
"""
AI LENS Favicon Generator
Creates favicon files in various sizes for newsai.earth
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

def create_favicon(size):
    """Create a favicon with AI LENS branding"""
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate proportions
    center = size // 2
    
    # Background circle with gradient effect
    for i in range(size//4):
        alpha = int(255 * (1 - i/(size//4)) * 0.8)
        radius = center - i
        color = (59, 130, 246, alpha)  # Blue gradient
        if radius > 0:
            draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                        fill=color, outline=None)
    
    # AI LENS atom symbol
    atom_radius = size // 6
    
    # Central nucleus
    nucleus_size = size // 12
    draw.ellipse([center-nucleus_size, center-nucleus_size, 
                 center+nucleus_size, center+nucleus_size], 
                fill=(251, 191, 36, 255))  # Gold/amber color
    
    # Orbital rings
    orbital_width = max(1, size // 64)
    for angle in [0, 60, 120]:
        rad = math.radians(angle)
        
        # Create orbital ellipse points
        points = []
        for t in range(360):
            t_rad = math.radians(t)
            x = center + atom_radius * math.cos(t_rad) * math.cos(rad) - atom_radius * 0.3 * math.sin(t_rad) * math.sin(rad)
            y = center + atom_radius * 0.3 * math.sin(t_rad) * math.cos(rad) + atom_radius * math.cos(t_rad) * math.sin(rad)
            points.append((x, y))
        
        # Draw orbital path
        for i in range(len(points)-1):
            draw.line([points[i], points[i+1]], fill=(251, 191, 36, 200), width=orbital_width)
    
    # Electrons on orbits
    if size >= 32:
        electron_size = max(1, size // 32)
        electron_positions = [
            (center + atom_radius, center),
            (center - atom_radius, center),
        ]
        
        for pos in electron_positions:
            draw.ellipse([pos[0]-electron_size, pos[1]-electron_size, 
                         pos[0]+electron_size, pos[1]+electron_size], 
                        fill=(251, 191, 36, 255))
    
    # Add "AI" text for larger sizes
    if size >= 64:
        try:
            font_size = size // 8
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        # AI text
        text = "AI"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = center - text_width // 2
        text_y = center + atom_radius // 2
        
        draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
    
    return img

def main():
    """Generate all favicon sizes"""
    output_dir = "/Users/sardag/newsai-earth-1/newsai-archive/public"
    
    # Create favicons in different sizes
    sizes = [16, 32, 48, 64, 96, 128, 180, 192, 512]
    
    for size in sizes:
        img = create_favicon(size)
        
        # Save as PNG
        if size == 180:
            filename = f"apple-touch-icon.png"
        else:
            filename = f"icon-{size}x{size}.png"
        
        filepath = os.path.join(output_dir, filename)
        img.save(filepath, "PNG")
        print(f"Created: {filename}")
    
    # Create favicon.ico (16x16, 32x32, 48x48)
    ico_sizes = [16, 32, 48]
    ico_images = []
    
    for size in ico_sizes:
        img = create_favicon(size)
        ico_images.append(img)
    
    # Save as ICO
    ico_path = os.path.join(output_dir, "favicon.ico")
    ico_images[0].save(ico_path, format='ICO', sizes=[(16,16), (32,32), (48,48)])
    print("Created: favicon.ico")
    
    print("All favicons generated successfully!")

if __name__ == "__main__":
    main()

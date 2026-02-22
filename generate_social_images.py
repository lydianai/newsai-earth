#!/usr/bin/env python3
"""
AI LENS Open Graph Image Generator
Creates social media preview images for newsai.earth
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_og_image():
    """Create Open Graph image for social media sharing"""
    width, height = 1200, 630
    img = Image.new('RGB', (width, height), (15, 23, 42))  # slate-900 background
    draw = ImageDraw.Draw(img)
    
    # Create gradient background
    for y in range(height):
        # Gradient from slate-900 to purple-900
        ratio = y / height
        r = int(15 + (59 - 15) * ratio)
        g = int(23 + (7 - 23) * ratio)  
        b = int(42 + (100 - 42) * ratio)
        
        for x in range(width):
            draw.point((x, y), (r, g, b))
    
    # Add some cosmic elements
    for i in range(50):
        import random
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(1, 3)
        alpha = random.randint(100, 255)
        draw.ellipse([x-size, y-size, x+size, y+size], fill=(96, 165, 250, alpha))
    
    # AI LENS Logo in center-left
    logo_center_x = width // 4
    logo_center_y = height // 2
    
    # Atom symbol
    atom_radius = 80
    nucleus_size = 20
    
    # Central nucleus
    draw.ellipse([logo_center_x-nucleus_size, logo_center_y-nucleus_size,
                 logo_center_x+nucleus_size, logo_center_y+nucleus_size],
                fill=(251, 191, 36))
    
    # Orbital rings
    orbital_width = 4
    for angle in [0, 60, 120]:
        import math
        rad = math.radians(angle)
        
        # Simple orbital approximation
        for t in range(360):
            t_rad = math.radians(t)
            x = logo_center_x + atom_radius * math.cos(t_rad) * math.cos(rad)
            y = logo_center_y + atom_radius * 0.4 * math.sin(t_rad) 
            if 0 <= x < width and 0 <= y < height:
                for offset in range(-orbital_width//2, orbital_width//2 + 1):
                    if 0 <= y + offset < height:
                        draw.point((int(x), int(y + offset)), (251, 191, 36))
    
    # Electrons
    electron_positions = [
        (logo_center_x + atom_radius, logo_center_y),
        (logo_center_x - atom_radius, logo_center_y),
        (logo_center_x + atom_radius//2, logo_center_y - atom_radius//3),
        (logo_center_x - atom_radius//2, logo_center_y + atom_radius//3),
    ]
    
    electron_size = 8
    for pos in electron_positions:
        draw.ellipse([pos[0]-electron_size, pos[1]-electron_size,
                     pos[0]+electron_size, pos[1]+electron_size],
                    fill=(251, 191, 36))
    
    # Text content
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 72)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 32)
        desc_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default() 
        desc_font = ImageFont.load_default()
    
    # Main title
    title_text = "AI NEWS - HUB"
    title_x = width * 0.55
    title_y = height * 0.25
    draw.text((title_x, title_y), title_text, fill=(96, 165, 250), font=title_font)
    
    # Subtitle
    subtitle_text = "by newsai.earth"
    subtitle_x = title_x
    subtitle_y = title_y + 80
    draw.text((subtitle_x, subtitle_y), subtitle_text, fill=(156, 163, 175), font=subtitle_font)
    
    # Description
    desc_lines = [
        "Revolutionary AI-Powered Scientific Intelligence Platform",
        "",
        "✨ EarthBrief • Digital Twin • Quantum Computing",
        "🚀 Metaverse • Research Lab • Knowledge Discovery", 
        "⚡ AI Agents • IoT Hub • Analytics Dashboard"
    ]
    
    desc_y = subtitle_y + 60
    for line in desc_lines:
        draw.text((title_x, desc_y), line, fill=(229, 231, 235), font=desc_font)
        desc_y += 35
    
    return img

def create_twitter_card():
    """Create Twitter Card image"""
    width, height = 1200, 675  # Twitter card dimensions
    img = Image.new('RGB', (width, height), (15, 23, 42))
    draw = ImageDraw.Draw(img)
    
    # Similar to OG image but adjusted for Twitter
    # Add gradient
    for y in range(height):
        ratio = y / height
        r = int(15 + (59 - 15) * ratio)
        g = int(23 + (7 - 23) * ratio)
        b = int(42 + (100 - 42) * ratio)
        
        for x in range(width):
            draw.point((x, y), (r, g, b))
    
    # Centered logo and text for Twitter format
    center_x = width // 2
    center_y = height // 2
    
    try:
        big_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 96)
        med_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 36)
    except:
        big_font = ImageFont.load_default()
        med_font = ImageFont.load_default()
    
    # AI LENS centered
    title = "AI NEWS - HUB"
    bbox = draw.textbbox((0, 0), title, font=big_font)
    text_width = bbox[2] - bbox[0]
    text_x = center_x - text_width // 2
    text_y = center_y - 60
    
    draw.text((text_x, text_y), title, fill=(96, 165, 250), font=big_font)
    
    # Subtitle
    subtitle = "Revolutionary AI Platform • newsai.earth"
    bbox = draw.textbbox((0, 0), subtitle, font=med_font)
    sub_width = bbox[2] - bbox[0]
    sub_x = center_x - sub_width // 2
    sub_y = text_y + 120
    
    draw.text((sub_x, sub_y), subtitle, fill=(229, 231, 235), font=med_font)
    
    return img

def main():
    """Generate social media images"""
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
    
    # Create Open Graph image
    og_img = create_og_image()
    og_path = os.path.join(output_dir, "og-image.png")
    og_img.save(og_path, "PNG", optimize=True)
    print("Created: og-image.png")
    
    # Create Twitter Card image
    twitter_img = create_twitter_card()
    twitter_path = os.path.join(output_dir, "twitter-card.png")
    twitter_img.save(twitter_path, "PNG", optimize=True)
    print("Created: twitter-card.png")
    
    # Create a general screenshot placeholder
    screenshot_img = create_og_image()  # Reuse OG image as screenshot
    screenshot_path = os.path.join(output_dir, "screenshot.png")
    screenshot_img.save(screenshot_path, "PNG", optimize=True)
    print("Created: screenshot.png")
    
    print("All social media images generated successfully!")

if __name__ == "__main__":
    main()

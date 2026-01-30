from PIL import Image

# Paths
base_path = 'C:/Users/Admin/.gemini/antigravity/brain/57724240-4349-408f-a815-f3335783fe00/uploaded_media_0_1769627019280.jpg'
qr_path = 'C:/Users/Admin/.gemini/antigravity/brain/57724240-4349-408f-a815-f3335783fe00/uploaded_media_1_1769627019280.jpg'
output_path = 'C:/Users/Admin/.gemini/antigravity/brain/57724240-4349-408f-a815-f3335783fe00/final_working_label_dark_green.png'

# Load images
base_img = Image.open(base_path)
qr_img = Image.open(qr_path)

print(f"Base size: {base_img.size}")
print(f"QR size: {qr_img.size}")

# Resize QR Code to be fit nicely (approx 25% of width)
target_qr_width = int(base_img.width * 0.25)
target_qr_height = target_qr_width # Square
qr_img = qr_img.resize((target_qr_width, target_qr_height), Image.Resampling.LANCZOS)

# Colorize the QR Code
# Convert to RGBA
qr_img = qr_img.convert("RGBA")
datas = qr_img.getdata()

new_data = []
# Very Dark Green (Almost Black) for maximum contrast while keeping the tone
# (20, 35, 15)
colored_green = (20, 35, 15, 255) 

# Semi-transparent white background to ensure "Quiet Zone" (contrast margin)
# Scanners often fail without a clean background.
# 150/255 opacity = ~60% visibility (enough to lighten the background but show texture)
background_white = (255, 255, 255, 150)

for item in datas:
    # item is (R, G, B, A)
    # If it's black (or close to black), make it dark green
    if item[0] < 150 and item[1] < 150 and item[2] < 150: 
        new_data.append(colored_green)
    else:
        # Instead of fully transparent, use semi-transparent white
        # This improves scanning reliability significantly
        new_data.append(background_white)

qr_img.putdata(new_data)

# Calculate position (Bottom Center)
# Padding from bottom
padding_bottom = int(base_img.height * 0.05) # 5% padding
x_pos = (base_img.width - target_qr_width) // 2
y_pos = base_img.height - target_qr_height - padding_bottom

print(f"Placing QR at: {x_pos}, {y_pos}")

# Overlay (using alpha composite for transparency)
base_img = base_img.convert("RGBA")
base_img.paste(qr_img, (x_pos, y_pos), qr_img)

# Save
base_img.save(output_path)
print(f"Saved to {output_path}")

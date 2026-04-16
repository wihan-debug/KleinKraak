from PIL import Image

# Paths
base_path = 'C:/Users/Admin/.gemini/antigravity/brain/57724240-4349-408f-a815-f3335783fe00/uploaded_media_0_1769627019280.jpg'
qr_path = 'C:/Users/Admin/.gemini/antigravity/brain/57724240-4349-408f-a815-f3335783fe00/uploaded_media_1_1769627019280.jpg'
output_path = 'C:/Users/Admin/.gemini/antigravity/brain/57724240-4349-408f-a815-f3335783fe00/final_simple_swap.png'

# Load images
base_img = Image.open(base_path)
qr_img = Image.open(qr_path)

print(f"Base size: {base_img.size}")
print(f"QR size: {qr_img.size}")

# Resize QR Code to be fit nicely (approx 25% of width)
# We keep it as is (Black and White) for maximum scanability
target_qr_width = int(base_img.width * 0.25)
target_qr_height = target_qr_width # Square
qr_img = qr_img.resize((target_qr_width, target_qr_height), Image.Resampling.LANCZOS)

# Calculate position (Bottom Center)
# Padding from bottom
padding_bottom = int(base_img.height * 0.05) # 5% padding
x_pos = (base_img.width - target_qr_width) // 2
y_pos = base_img.height - target_qr_height - padding_bottom

print(f"Placing QR at: {x_pos}, {y_pos}")

# Overlay standard paste (no mask, just overwrite)
base_img.paste(qr_img, (x_pos, y_pos))

# Save
base_img.save(output_path)
print(f"Saved to {output_path}")

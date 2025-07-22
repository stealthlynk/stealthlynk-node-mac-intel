from PIL import Image

# Open the logo image
logo_path = "logo.png"
logo = Image.open(logo_path)

# Define the sizes for the icons
sizes = [(16, 16), (32, 32), (128, 128), (256, 256), (512, 512)]

# Create resized icons and save them with the correct names
for size in sizes:
    icon = logo.resize(size, Image.Resampling.LANCZOS)
    icon.save(f"icon_{size[0]}x{size[1]}.png")
    
    # Save the 2x versions (scaled images)
    icon_2x = logo.resize((size[0]*2, size[1]*2), Image.Resampling.LANCZOS)
    icon_2x.save(f"icon_{size[0]}x{size[1]}@2x.png")


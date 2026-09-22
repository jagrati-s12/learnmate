import re

# Fix Button.tsx
with open("src/components/ui/Button.tsx", "r") as f:
    btn = f.read()

# Make buttons pill-shaped
btn = btn.replace("rounded-lg", "rounded-full")

with open("src/components/ui/Button.tsx", "w") as f:
    f.write(btn)

# Fix Card.tsx
try:
    with open("src/components/ui/Card.tsx", "r") as f:
        card = f.read()
    
    # Increase drop-shadow for cleaner isolation and round the corners more
    card = card.replace("rounded-xl border border-gray-200", "rounded-2xl border border-gray-100 shadow-sm")
    
    with open("src/components/ui/Card.tsx", "w") as f:
        f.write(card)
except FileNotFoundError:
    pass
    
# Fix general UI elements in the CSS
with open("src/index.css", "r") as f:
    css = f.read()

# Soften MyFIU clean shadow 
css = css.replace("box-shadow: 0 4px 20px rgba(0, 0, 0, .04)", "box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04)")    
css = css.replace("border: 1px solid #e9e8f0;", "border: 1px solid #f1f3f5;")

with open("src/index.css", "w") as f:
    f.write(css)


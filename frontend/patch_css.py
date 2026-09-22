import re

with open("src/index.css", "r") as f:
    css = f.read()

# Backgrounds
css = css.replace("background: #f7f8fc;", "background: #f4f6f8; /* Modern lighter gray */")

# Primary brand colors (Purples -> Modern Royal Blue/Indigo)
css = css.replace("#7047ef", "#2563EB") # Brand main
css = css.replace("#a78bfa", "#60A5FA") # Brand light
css = css.replace("#6542dd", "#1D4ED8") # Nav hover text
css = css.replace("#6240df", "#1E3A8A") # Nav active text
css = css.replace("#f5f3ff", "#EFF6FF") # Nav hover bg
css = css.replace("#eee9ff", "#DBEAFE") # Nav active bg

# Exam cards & Icons
css = css.replace("#f0ebff", "#DBEAFE") # Card icon bg
css = css.replace("#7049e7", "#2563EB") # Card icon color
css = css.replace("#f0ecff", "#DBEAFE") 
css = css.replace("#714be7", "#2563EB")

# Links and Progress
css = css.replace("#6945df", "#2563EB") 
css = css.replace("#7652e9", "#2563EB") # Progress fill
css = css.replace("#d9cffd", "#BFDBFE") # Bar gradient bottom

# Chat
css = css.replace("#f3f1fa", "#F3F4F6") # Chat bubble
css = css.replace("#7047e7", "#2563EB") # Primary buttons & chat User

# Flashcard & AI
css = css.replace("#7450e6", "#2563EB") 
css = css.replace("#321f68", "#1E3A8A")
css = css.replace("#eee8ff", "#DBEAFE")
css = css.replace("#f5f2ff", "#EFF6FF")

# Button styling (Convert to Pill / Modern Khan Academy style)
css = re.sub(r"border-radius:\s*9px;", "border-radius: 9999px;", css) # Primary/Secondary buttons
css = re.sub(r"border-radius:\s*10px;", "border-radius: 12px;", css) # Small elements
css = re.sub(r"border-radius:\s*14px;", "border-radius: 16px;", css) # Cards

# Enhance Card Shadows (MyFIU style cleanliness)
css = css.replace("box-shadow: 0 4px 16px rgba(42, 36, 72, .03)", "box-shadow: 0 4px 20px rgba(0, 0, 0, .04)")
css = css.replace("box-shadow: 0 3px 14px rgba(40, 36, 72, .025)", "box-shadow: 0 2px 12px rgba(0, 0, 0, .03)")

# Typography adjustments
css = css.replace("font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;", "font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; letter-spacing: -0.01em;")

with open("src/index.css", "w") as f:
    f.write(css)

import re

with open("src/index.css", "r") as f:
    css = f.read()

# === BACKGROUNDS ===
# Primary background (was #f4f6f8 light gray)
css = css.replace("background: #f4f6f8;", "background: #171411;")
css = css.replace("background-color: #242424", "background-color: #171411")

# Sidebar/Cards/Surfaces (was white #fff)
css = re.sub(r"background:\s*#fff;", "background: #211C18;", css)
css = re.sub(r"background:\s*#ffffff;", "background: #211C18;", css, flags=re.IGNORECASE)

# Elevated surfaces (stat cards, etc)
css = css.replace("background: #F3F4F6;", "background: #28211C;")

# === TEXT COLORS ===
# Primary text (was dark #1e2230)
css = css.replace("color: #1e2230", "color: #F3EDE3")
css = css.replace("color: #272a35;", "color: #F3EDE3;")
css = css.replace("color: #101828", "color: #F3EDE3")

# Secondary/muted text
css = css.replace("color: #858896;", "color: #C8BFB2;")
css = css.replace("color: #9295a0", "color: #968C80")
css = css.replace("color: #8b8e9c;", "color: #968C80;")
css = css.replace("color: #a2a4ae;", "color: #968C80;")
css = css.replace("color: #626675;", "color: #C8BFB2;")
css = css.replace("color: #545866;", "color: #C8BFB2;")
css = css.replace("color: #667085", "color: #968C80")
css = css.replace("color: #475467", "color: #968C80")

# === ACCENT COLORS (Blue -> Champagne Gold) ===
css = css.replace("#2563EB", "#C9A66B")  # Primary blue -> gold
css = css.replace("#1D4ED8", "#A8895C")  # Darker blue -> darker gold
css = css.replace("#1E3A8A", "#8A7049")  # Darkest blue -> darkest gold
css = css.replace("#60A5FA", "#D8B87C")  # Light blue -> light gold
css = css.replace("#BFDBFE", "#E8D4A8")  # Very light blue -> very light gold

# Background accent areas
css = css.replace("#EFF6FF", "#2B2419")  # Light blue bg -> warm dark
css = css.replace("#DBEAFE", "#302821")  # Blue surface -> elevated surface

# === BORDERS ===
css = css.replace("border: 1px solid #e9eaf0;", "border: 1px solid rgba(243, 237, 227, 0.08);")
css = css.replace("border: 1px solid #f1f3f5;", "border: 1px solid rgba(243, 237, 227, 0.08);")
css = css.replace("border: 1px solid #e9e8f0;", "border: 1px solid rgba(243, 237, 227, 0.08);")
css = css.replace("border: 1px solid #ececf2;", "border: 1px solid rgba(243, 237, 227, 0.08);")
css = css.replace("border: 1px solid #eeeef3;", "border: 1px solid rgba(243, 237, 227, 0.08);")
css = css.replace("border: 1px solid #f0f0f4", "border: 1px solid rgba(243, 237, 227, 0.08)")
css = css.replace("border: 1px solid #e5e7eb;", "border: 1px solid rgba(243, 237, 227, 0.10);")
css = css.replace("border-bottom: 1px solid #eee;", "border-bottom: 1px solid rgba(243, 237, 227, 0.08);")
css = css.replace("border-top: 1px solid #eee;", "border-top: 1px solid rgba(243, 237, 227, 0.08);")

# === SHADOWS ===
css = css.replace("box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04)", "box-shadow: 0 12px 35px rgba(0, 0, 0, 0.22)")
css = css.replace("box-shadow: 0 2px 12px rgba(0, 0, 0, .03)", "box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18)")
css = css.replace("box-shadow: 0 4px 16px rgba(42, 36, 72, .03)", "box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18)")

# === SPECIFIC UI ELEMENTS ===
# Avatar backgrounds
css = css.replace("background: #e8eaf0;", "background: #302821;")

# Muted backgrounds
css = css.replace("background: #ececf2;", "background: #28211C;")
css = css.replace("background: #f0f0f4", "background: #28211C")

# Input/form backgrounds
css = css.replace("background: #f7f7fb;", "background: #211C18;")

with open("src/index.css", "w") as f:
    f.write(css)

print("Premium dark palette applied to index.css")

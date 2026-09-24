import re

with open("src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

# Protect the theme definition block so we don't overwrite the variable definitions!
def protect_themes(match):
    return match.group(0).replace('#', '___HASH___')

css = re.sub(r':root\s*\[data-theme="[^"]+"\]\s*{[^}]+}', protect_themes, css)
css = re.sub(r':root\s*{[^}]+}', protect_themes, css)

# Backgrounds - Dark
css = re.sub(r'#171411', 'var(--bg-primary)', css, flags=re.IGNORECASE)
css = re.sub(r'#211C18', 'var(--bg-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'#28211C', 'var(--bg-surface)', css, flags=re.IGNORECASE)
css = re.sub(r'#302821', 'var(--bg-elevated)', css, flags=re.IGNORECASE)
css = re.sub(r'#2B2419', 'var(--bg-elevated)', css, flags=re.IGNORECASE)

# Backgrounds - Light/White/Gray stragglers
css = re.sub(r'#f2f4f7', 'var(--bg-elevated)', css, flags=re.IGNORECASE)
css = re.sub(r'#F3F4F6', 'var(--bg-elevated)', css, flags=re.IGNORECASE)
css = re.sub(r'#eeeaff', 'var(--bg-elevated)', css, flags=re.IGNORECASE)
css = re.sub(r'#f1eff7', 'var(--bg-elevated)', css, flags=re.IGNORECASE)
css = re.sub(r'#faf8ff', 'var(--bg-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'#faf7ff', 'var(--bg-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'#faf9ff', 'var(--bg-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'#1e2230', 'var(--bg-secondary)', css, flags=re.IGNORECASE)
# Be careful with #fff since it might be icon color or standard
css = re.sub(r'background:\s*#fff(?:fff)?\b', 'background: var(--bg-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'background-color:\s*#fff(?:fff)?\b', 'background-color: var(--bg-secondary)', css, flags=re.IGNORECASE)

# Text Colors - Dark
css = re.sub(r'#F3EDE3', 'var(--text-primary)', css, flags=re.IGNORECASE)
css = re.sub(r'#C8BFB2', 'var(--text-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'#968C80', 'var(--text-muted)', css, flags=re.IGNORECASE)

# Text Colors - Light stragglers
css = re.sub(r'color:\s*#101828', 'color: var(--text-primary)', css, flags=re.IGNORECASE)
css = re.sub(r'color:\s*#344054', 'color: var(--text-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'color:\s*#475467', 'color: var(--text-muted)', css, flags=re.IGNORECASE)
css = re.sub(r'color:\s*#000(?:000)?\b', 'color: var(--text-primary)', css, flags=re.IGNORECASE)

# Accents
css = re.sub(r'#C9A66B', 'var(--accent-primary)', css, flags=re.IGNORECASE)
css = re.sub(r'#A8895C', 'var(--accent-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'#D8B87C', 'var(--accent-secondary)', css, flags=re.IGNORECASE)
css = re.sub(r'#7550ee', 'var(--accent-primary)', css, flags=re.IGNORECASE)
css = re.sub(r'#7c3aed', 'var(--accent-primary)', css, flags=re.IGNORECASE)

# Borders
css = re.sub(r'rgba\(243,\s*237,\s*227,\s*0\.08\)', 'var(--border-subtle)', css, flags=re.IGNORECASE)
css = re.sub(r'rgba\(243,\s*237,\s*227,\s*0\.1[05]\)', 'var(--border-subtle)', css, flags=re.IGNORECASE)
css = re.sub(r'rgba\(243,\s*237,\s*227,\s*0\.2[05]\)', 'var(--border-default)', css, flags=re.IGNORECASE)

# Unprotect
css = css.replace('___HASH___', '#')

with open("src/index.css", "w", encoding="utf-8") as f:
    f.write(css)

print("CSS updated.")

# Add light mode CSS variables and theme switching

light_dark_css = '''
/* ============================================
   THEME VARIABLES - Light & Dark Mode
   ============================================ */

:root[data-theme="dark"] {
  --bg-primary: #171411;
  --bg-secondary: #211C18;
  --bg-surface: #28211C;
  --bg-elevated: #302821;
  
  --text-primary: #F3EDE3;
  --text-secondary: #C8BFB2;
  --text-muted: #968C80;
  
  --accent-primary: #C9A66B;
  --accent-secondary: #A8895C;
  
  --border-subtle: rgba(243, 237, 227, 0.08);
  --border-default: rgba(243, 237, 227, 0.10);
  
  --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.18);
}

:root[data-theme="light"] {
  --bg-primary: #F8F6F3;
  --bg-secondary: #FFFFFF;
  --bg-surface: #FDFCFB;
  --bg-elevated: #F5F3F0;
  
  --text-primary: #211C18;
  --text-secondary: #4A4541;
  --text-muted: #7A7470;
  
  --accent-primary: #A8895C;
  --accent-secondary: #8A7049;
  
  --border-subtle: rgba(33, 28, 24, 0.08);
  --border-default: rgba(33, 28, 24, 0.12);
  
  --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* Apply CSS variables */
body {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.sidebar {
  background: var(--bg-primary);
  border-right: 1px solid var(--border-subtle);
}

.topbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-card);
}

.nav-item {
  color: var(--text-secondary);
}

.nav-item:hover {
  background: var(--bg-elevated);
  color: var(--accent-primary);
}

.nav-item.active {
  background: var(--bg-surface);
  color: var(--accent-primary);
}
'''

with open("src/index.css", "r") as f:
    css = f.read()

# Insert theme variables at the top after tailwind imports
tailwind_end = css.find("* {")
if tailwind_end != -1:
    css = css[:tailwind_end] + light_dark_css + "\n\n" + css[tailwind_end:]

with open("src/index.css", "w") as f:
    f.write(css)

print("Light/Dark mode CSS added")

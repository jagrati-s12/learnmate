import os
import re

mapping = {
    r'bg-gradient-to-br from-\[\#171411\] via-\[\#211C18\] to-\[\#28211C\]': 'bg-theme-bg-primary',
    r'from-\[\#C9A66B\]': 'from-theme-accent-primary',
    r'to-\[\#D8B87C\]': 'to-theme-accent-secondary',
    r'bg-\[\#171411\]': 'bg-theme-bg-primary',
    r'bg-\[\#211C18\]': 'bg-theme-bg-secondary',
    r'bg-\[\#28211C\]': 'bg-theme-bg-surface',
    r'bg-\[\#302821\]': 'bg-theme-bg-elevated',
    r'bg-\[\#2B2419\]': 'bg-theme-bg-elevated',
    r'text-\[\#F3EDE3\]': 'text-theme-text-primary',
    r'text-\[\#C8BFB2\]': 'text-theme-text-secondary',
    r'text-\[\#968C80\]': 'text-theme-text-muted',
    r'text-\[\#C9A66B\]': 'text-theme-accent-primary',
    r'text-\[\#A8895C\]': 'text-theme-accent-secondary',
    r'border-\[\#F3EDE3\]\/10': 'border-theme-border',
    r'border-\[\#28211C\]': 'border-theme-border',
    r'border-\[rgba\(243,237,227,0\.10\)\]': 'border-theme-border',
    r'hover:border-\[\#C9A66B\]\/30': 'hover:border-theme-accent-primary/30',
    r'focus:ring-\[\#C9A66B\]': 'focus:ring-theme-accent-primary',
    r'disabled:bg-\[\#302821\]': 'disabled:bg-theme-bg-elevated'
}

files_changed = 0

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.jsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            for pat, repl in mapping.items():
                new_content = re.sub(pat, repl, new_content, flags=re.IGNORECASE)

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file_path}")
                files_changed += 1

print(f"Total files updated: {files_changed}")
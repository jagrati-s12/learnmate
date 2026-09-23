import os
import glob

# Walk through all jsx/tsx files and change purple to blue for consistency with the new CSS palette
files = glob.glob('src/**/*.jsx', recursive=True) + glob.glob('src/**/*.tsx', recursive=True)

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace common tailwind purple classes with blue
    new_content = content.replace("purple-50/", "blue-50/")
    new_content = new_content.replace("purple-50", "blue-50")
    new_content = new_content.replace("purple-100", "blue-100")
    new_content = new_content.replace("purple-200", "blue-200")
    new_content = new_content.replace("purple-300", "blue-300")
    new_content = new_content.replace("purple-400", "blue-400")
    new_content = new_content.replace("purple-500", "blue-500")
    new_content = new_content.replace("purple-600", "blue-600")
    new_content = new_content.replace("purple-700", "blue-700")
    new_content = new_content.replace("purple-800", "blue-800")
    new_content = new_content.replace("purple-900", "blue-900")
    
    # Also adjust any indigo in gradients or buttons
    new_content = new_content.replace("from-purple-600 to-indigo-600", "from-blue-600 to-blue-700")
    new_content = new_content.replace("hover:from-purple-700 hover:to-indigo-700", "hover:from-blue-700 hover:to-blue-800")
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
            print(f"Updated {filepath}")


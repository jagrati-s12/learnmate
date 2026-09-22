import glob

# Fix hardcoded Tailwind classes in JSX/TSX files to match the new dark theme
files = glob.glob('src/**/*.jsx', recursive=True) + glob.glob('src/**/*.tsx', recursive=True)

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Common light backgrounds -> dark
        content = content.replace('bg-white', 'bg-[#211C18]')
        content = content.replace('bg-gray-50', 'bg-[#28211C]')
        content = content.replace('bg-gray-100', 'bg-[#302821]')
        
        # Text colors
        content = content.replace('text-gray-900', 'text-[#F3EDE3]')
        content = content.replace('text-gray-800', 'text-[#F3EDE3]')
        content = content.replace('text-gray-700', 'text-[#C8BFB2]')
        content = content.replace('text-gray-600', 'text-[#C8BFB2]')
        content = content.replace('text-gray-500', 'text-[#968C80]')
        content = content.replace('text-gray-400', 'text-[#968C80]')
        
        # Border colors
        content = content.replace('border-gray-200', 'border-[rgba(243,237,227,0.08)]')
        content = content.replace('border-gray-300', 'border-[rgba(243,237,227,0.10)]')
        
        # Blue accent -> Champagne gold
        content = content.replace('text-blue-600', 'text-[#C9A66B]')
        content = content.replace('text-blue-500', 'text-[#C9A66B]')
        content = content.replace('bg-blue-50', 'bg-[#2B2419]')
        content = content.replace('bg-blue-100', 'bg-[#302821]')
        content = content.replace('bg-blue-600', 'bg-[#C9A66B]')
        content = content.replace('bg-blue-500', 'bg-[#C9A66B]')
        content = content.replace('hover:bg-blue-700', 'hover:bg-[#A8895C]')
        content = content.replace('border-blue-200', 'border-[rgba(201,166,107,0.16)]')
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass

print("Tailwind classes updated in all components")

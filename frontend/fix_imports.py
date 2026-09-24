import re
with open("src/collab/components/layout/Sidebar.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Only keep one Shield and one User
lines = text.split('\n')
seen = set()
out = []
in_import = False
for line in lines:
    if "lucide-react" in line:
        out.append(line)
        in_import = False
        continue
    if "import {" in line and ("lucide-react" not in line) and "from" not in line:
        in_import = True
    
    if in_import:
        match = re.search(r'([A-Za-z0-9_]+),?', line)
        if match:
            sym = match.group(1)
            if sym in seen:
                continue
            seen.add(sym)
    out.append(line)

with open("src/collab/components/layout/Sidebar.jsx", "w", encoding="utf-8") as f:
    f.write('\n'.join(out))

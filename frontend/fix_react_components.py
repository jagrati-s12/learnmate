import os
import glob

# Update React Button component to use champagne gold
with open("src/components/ui/Button.tsx", "r") as f:
    btn = f.read()

# Change primary button from blue to champagne gold
btn = btn.replace("bg-blue-600", "bg-[#C9A66B]")
btn = btn.replace("hover:bg-blue-700", "hover:bg-[#A8895C]")
btn = btn.replace("focus:ring-blue-500", "focus:ring-[#C9A66B]")

# Secondary/outline focus rings
btn = btn.replace("focus:ring-gray-500", "focus:ring-[#C9A66B]")

# Text color for primary button (dark espresso on gold)
btn = btn.replace("bg-[#C9A66B] text-white", "bg-[#C9A66B] text-[#171411]")

with open("src/components/ui/Button.tsx", "w") as f:
    f.write(btn)

# Update Card component
try:
    with open("src/components/ui/Card.tsx", "r") as f:
        card = f.read()
    
    # Dark backgrounds
    card = card.replace("bg-white", "bg-[#211C18]")
    card = card.replace("border-gray-200", "border-[rgba(243,237,227,0.08)]")
    card = card.replace("border-gray-100", "border-[rgba(243,237,227,0.08)]")
    
    with open("src/components/ui/Card.tsx", "w") as f:
        f.write(card)
except:
    pass

print("React components updated")

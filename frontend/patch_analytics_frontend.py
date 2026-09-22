with open("src/api/analytics.ts", "r") as f:
    text = f.read()

text = text.replace("}\n  getAIProfile", "},\n  getAIProfile")

with open("src/api/analytics.ts", "w") as f:
    f.write(text)

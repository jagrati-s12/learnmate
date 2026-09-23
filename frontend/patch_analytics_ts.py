import re

with open("src/api/analytics.ts", "r") as f:
    text = f.read()

text = text.replace("getAIProfile: async () => {", "getAIProfile: async (): Promise<{ profile: string }> => {")

with open("src/api/analytics.ts", "w") as f:
    f.write(text)

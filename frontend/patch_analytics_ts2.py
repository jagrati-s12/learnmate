import re

with open("src/api/analytics.ts", "r") as f:
    text = f.read()

text = text.replace("api.get('/analytics/ai-profile')", "api.get<{profile: string}>('/analytics/ai-profile')")

with open("src/api/analytics.ts", "w") as f:
    f.write(text)

with open("src/api/mockTests.ts", "r") as f:
    text2 = f.read()

text2 = text2.replace("generateAITest: async (data:", "generateAITest: async (data:").replace("apiClient.post('/mock-tests", "apiClient.post<MockTest>('/mock-tests")

with open("src/api/mockTests.ts", "w") as f:
    f.write(text2)

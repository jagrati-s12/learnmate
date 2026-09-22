with open("src/api/mockTests.ts", "r") as f:
    orig = f.read()

if "generateAITest" not in orig:
    # insert before last closing brace
    idx = orig.rfind("}")
    new_method = """  generateAITest: async (data: { branch_id: number, total_questions?: number, adaptation_weight?: number }) => {
    const response = await api.post('/mock-tests/generate-personalized', data);
    return response.data;
  },
"""
    new_orig = orig[:idx] + new_method + orig[idx:]
    with open("src/api/mockTests.ts", "w") as f:
        f.write(new_orig)

with open("src/api/analytics.ts", "r", encoding="utf-8") as f:
    body = f.read()
if "getAIProfile" not in body:
    idx2 = body.rfind("}")
    new_method2 = """  getAIProfile: async () => {
    const response = await api.get('/analytics/ai-profile');
    return response.data;
  },
"""
    body2 = body[:idx2] + new_method2 + body[idx2:]
    with open("src/api/analytics.ts", "w", encoding="utf-8") as f:
        f.write(body2)

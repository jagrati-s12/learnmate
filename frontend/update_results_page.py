import re

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/ResultsPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("import { useNavigate }", "import { useNavigate, useParams }")
content = content.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n  const { attemptId } = useParams<{ attemptId: string }>();"
)

old_load = """        // For now, let's get the user's latest attempt
        const attempts = await mockTestsAPI.getUserAttempts();
        if (attempts.length > 0) {
          const latestAttempt = attempts[0];
          const detailedResult = await mockTestsAPI.getTestResult(latestAttempt.attempt_id);
          setResult(detailedResult);
        } else {
          // No attempts yet - show empty state
          setResult(null);
        }"""

new_load = """        if (attemptId) {
          const detailedResult = await mockTestsAPI.getTestResult(Number(attemptId));
          setResult(detailedResult);
        } else {
          const attempts = await mockTestsAPI.getUserAttempts();
          if (attempts.length > 0) {
            const latestAttempt = attempts[0];
            const detailedResult = await mockTestsAPI.getTestResult(latestAttempt.attempt_id);
            setResult(detailedResult);
          } else {
            setResult(null);
          }
        }"""

content = content.replace(old_load, new_load)

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/ResultsPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ResultsPage.tsx")

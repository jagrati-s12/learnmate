import re

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/MockTestPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Modify submitTest to navigate
old_submit = """        const resultData = await mockTestsAPI.submitTest(
          attemptId as number,
          answerSubmissions
        );
        setResult(resultData);
        setShowResults(true);"""

new_submit = """        const resultData = await mockTestsAPI.submitTest(
          attemptId as number,
          answerSubmissions
        );
        navigate(`/results/${attemptId}`);"""

content = content.replace(old_submit, new_submit)

# Remove the showResults block
content = re.sub(
    r"  if \(showResults && result\) \{.*?(?=  return \()",
    "",
    content,
    flags=re.DOTALL
)

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/MockTestPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated MockTestPage.tsx")

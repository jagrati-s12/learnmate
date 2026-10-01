import re

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/MockTestPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace React imports
content = content.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { useNavigate, useParams } from 'react-router-dom';"
)

# Insert retrieving testId
content = re.sub(
    r"const navigate = useNavigate\(\);",
    "const navigate = useNavigate();\n  const { testId } = useParams<{ testId: string }>();",
    content
)

# Use regex to find and replace the two useEffects because the literal string match might fail due to indent
content = re.sub(
    r"  useEffect\(\(\) => \{\n    const loadTest.*?\[test, isTestStarted\]\);",
    """  useEffect(() => {
    if (!testId) {
        navigate('/tests');
        return;
    }

    if (!isTestStarted) {
      const startTest = async () => {
        try {
          setLoading(true);
          const testData = await mockTestsAPI.startTest(Number(testId));
          setTest(testData.mock_test);
          setAttemptId(testData.attempt_id);
          setQuestions(testData.questions);
          setTimeRemaining(testData.mock_test.duration_minutes * 60);
          setIsTestStarted(true);
          startTimer();
        } catch (err: any) {
          setError(err.message || 'Failed to start mock test');
        } finally {
          setLoading(false);
        }
      };

      startTest();
    }
  }, [testId, navigate, isTestStarted]);""",
    content,
    flags=re.DOTALL
)

content = content.replace("if (loading || !test) {", "if (loading || (!test && !error)) {")
content = content.replace("Topbar title={`Mock Test • ${test.name}`}", "Topbar title={`Mock Test • ${test?.name || 'Loading'}`}")

with open("C:/Users/ELYSIUM/Documents/VSCODE/learnmate/frontend/src/pages/student/MockTestPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated MockTestPage.tsx")

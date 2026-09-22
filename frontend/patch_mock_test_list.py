import re

with open("src/pages/student/MockTestsListPage.tsx", "r") as f:
    content = f.read()

if "generateAITest" not in content:
    # Add imports
    content = content.replace(
        "import { Icons } from '../../assets/icons';",
        "import { Icons } from '../../assets/icons';\nimport { Brain } from 'lucide-react';"
    )
    
    # Add state
    content = content.replace(
        "const [error, setError] = useState<string | null>(null);",
        "const [error, setError] = useState<string | null>(null);\n  const [generating, setGenerating] = useState(false);\n"
    )
    
    # Add handler
    handler_code = """
  const handleGenerateAI = async () => {
    try {
      setGenerating(true);
      setError(null);
      // HARDCODE BRANCH 2 for now based on ProgressPage logic
      const newTest = await mockTestsAPI.generateAITest({ branch_id: 2, total_questions: 100 });
      setTests([newTest, ...tests]);
      navigate(`/tests/${newTest.id}`);
    } catch (err) {
      setError('Failed to generate AI Test');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
"""
    content = content.replace("useEffect(() => {", handler_code + "\n  useEffect(() => {")
    
    # Add button
    button_ui = """
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Available Mock Tests</h1>
          <Button 
            variant="primary" 
            onClick={handleGenerateAI} 
            disabled={generating}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            {generating ? 'Analyzing profile...' : 'Generate AI Test'}
          </Button>
        </div>"""
    content = content.replace(
        '<h1 className="text-2xl font-bold mb-6 text-gray-900">Available Mock Tests</h1>',
        button_ui
    )
    
    with open("src/pages/student/MockTestsListPage.tsx", "w") as f:
        f.write(content)

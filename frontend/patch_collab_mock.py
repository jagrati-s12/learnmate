with open("src/collab/components/test/MockTest.jsx", "r") as f:
    text = f.read()

# Add Brain import
if "Brain" not in text:
    text = text.replace("Loader2\n} from", "Loader2,\n  Brain\n} from")

if "handleGenerateAI" not in text:
    state_injection = """  const [generating, setGenerating] = useState(false);

  const handleGenerateAI = async () => {
    try {
      setGenerating(true);
      setError(null);
      const newTest = await mockTestsAPI.generateAITest({ branch_id: 2, total_questions: 100 });
      setTestList([newTest, ...testList]);
    } catch (err) {
      setError('Failed to generate AI Test');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
"""
    # Insert it inside the component
    text = text.replace("const [submitted, setSubmitted] = useState(false);", "const [submitted, setSubmitted] = useState(false);\n" + state_injection)
    
    # Render the button in the UI
    # We need to find where testList is rendered
    ui_injection = """
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Available Mock Tests</h2>
        <button
          onClick={handleGenerateAI}
          disabled={generating}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {generating ? 'Analyzing...' : 'Generate AI Test'}
        </button>
      </div>
"""
    # It probably has a heading or <ul>. Let's just put it before mapping testList.
    text = text.replace('<div className="space-y-4">', ui_injection + '\n      <div className="space-y-4">')

with open("src/collab/components/test/MockTest.jsx", "w") as f:
    f.write(text)

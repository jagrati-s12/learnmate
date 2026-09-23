with open("src/pages/student/ProfilePage.tsx", "r") as f:
    content = f.read()

# Make sure imports are there
if "analyticsAPI" not in content:
    content = content.replace("import { mockTestsAPI", "import { analyticsAPI } from '../../api/analytics';\nimport { mockTestsAPI")
if "Brain" not in content:
    content = content.replace("import { Icons } from '../../assets/icons';", "import { Icons } from '../../assets/icons';\nimport { Brain } from 'lucide-react';")

# Add state
if "aiProfile" not in content:
    content = content.replace(
        "const [attempts, setAttempts] = useState<MockTestAttempt[]>([]);",
        "const [attempts, setAttempts] = useState<MockTestAttempt[]>([]);\n  const [aiProfile, setAiProfile] = useState<string | null>(null);\n  const [loadingAi, setLoadingAi] = useState(false);\n"
    )

    # replace loadStats
    content = content.replace("""    const loadStats = async () => {
      try {
        const userAttempts = await mockTestsAPI.getUserAttempts();
        setAttempts(userAttempts);
      } catch (err) {
        // Silently fail - we still show user data even if attempts fail to load
      }
    };""", """    const loadStats = async () => {
      try {
        const userAttempts = await mockTestsAPI.getUserAttempts();
        setAttempts(userAttempts);
      } catch (err) {}
      
      try {
        setLoadingAi(true);
        const aiData = await analyticsAPI.getAIProfile();
        if (aiData && aiData.profile) {
          setAiProfile(aiData.profile);
        }
      } catch (e) {
        console.error('Failed to load AI', e);
      } finally {
        setLoadingAi(false);
      }
    };""")

    # Inject the Card UI
    card_ui = """
          <Card className="mb-6 border-purple-200">
            <CardHeader className="bg-purple-50 flex flex-row items-center gap-2 border-b-0 pb-0">
              <Brain className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-900 border-none m-0">AI Test Personality Profile</h2>
            </CardHeader>
            <CardBody>
              {loadingAi ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse flex space-x-2 items-center">
                    <Brain className="text-purple-300 w-5 h-5" />
                    <span className="text-purple-400">Analyzing past tests...</span>
                  </div>
                </div>
              ) : aiProfile ? (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {aiProfile}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Take more mock tests to enable your AI Personality Profile!
                </div>
              )}
            </CardBody>
          </Card>
"""
    # put it right before "          {/* Stats Grid */}"
    content = content.replace("          {/* Stats Grid */}", card_ui + "\n          {/* Stats Grid */}")

    with open("src/pages/student/ProfilePage.tsx", "w") as f:
        f.write(content)

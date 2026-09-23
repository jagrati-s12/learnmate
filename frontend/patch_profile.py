import re

with open("src/pages/student/ProfilePage.tsx", "r") as f:
    content = f.read()

if "getAIProfile" not in content:
    content = content.replace("import { mockTestsAPI", "import { analyticsAPI } from '../../api/analytics';\nimport { mockTestsAPI")
    content = content.replace("import { Icons } from '../../assets/icons';", "import { Icons } from '../../assets/icons';\nimport { Brain } from 'lucide-react';")
    
    # State for ai profile
    content = content.replace(
        "const [attempts, setAttempts] = useState<MockTestAttempt[]>([]);",
        "const [attempts, setAttempts] = useState<MockTestAttempt[]>([]);\n  const [aiProfile, setAiProfile] = useState<string | null>(null);\n  const [loadingAi, setLoadingAi] = useState(false);\n"
    )
    
    # modify loadStats to also fetch ai profile
    new_loadStats = """
    const loadStats = async () => {
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
        console.error('Failed to load AI profile', e);
      } finally {
        setLoadingAi(false);
      }
    };
"""
    content = re.sub(r"const loadStats = async \(\) => \{.+?catch \(err\) \{.+?\}\s*\};", new_loadStats, content, flags=re.DOTALL)
    
    ai_card_ui = """
          {/* AI Profile Section */}
          <Card className="col-span-1 md:col-span-3 border-purple-200">
            <CardHeader className="bg-purple-50 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-purple-900 border-none">AI Test Personality Profile</h2>
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
                <div className="whitespace-pre-line text-gray-700">
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
    # Insert before the Personal Information card
    content = content.replace('{/* Left Column - Personal Info */}', ai_card_ui + '\n          {/* Left Column - Personal Info */}')
    
    with open("src/pages/student/ProfilePage.tsx", "w") as f:
        f.write(content)

with open("src/pages/student/ProfilePage.tsx", "r") as f:
    text = f.read()

card_ui = """
          {/* AI Personality */}
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
if "AI Personality" not in text:
    text = text.replace("          {/* Stats Cards */}", card_ui + "\n          {/* Stats Cards */}")
    
with open("src/pages/student/ProfilePage.tsx", "w") as f:
    f.write(text)

import re

with open("src/collab/pages/Performance.jsx", "r") as f:
    text = f.read()

if "getAIProfile" not in text:
    if "Brain" not in text:
        text = text.replace("AlertCircle } from", "AlertCircle, Brain, Sparkles } from")
        
    state_injection = """  const [aiProfile, setAiProfile] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);"""
    
    text = text.replace("const [performanceData, setPerformanceData] = useState(null);", "const [performanceData, setPerformanceData] = useState(null);\n" + state_injection)
    
    # fetch AI inside useEffect
    fetch_ai = """
    const fetchAIProfile = async () => {
      try {
        setLoadingAi(true);
        const data = await analyticsAPI.getAIProfile();
        if (data && data.profile) setAiProfile(data.profile);
      } catch (error) {
        console.error('Failed to load AI', error);
      } finally {
        setLoadingAi(false);
      }
    };
    fetchAIProfile();
"""
    text = text.replace("fetchPerformance();", "fetchPerformance();\n" + fetch_ai)
    
    ai_ui = """
      {/* AI Test Personality */}
      <div className="card mb-6 border-2 border-purple-100 shadow-md bg-gradient-to-br from-white to-purple-50/30">
        <div className="border-b border-purple-100 pb-4 mb-4 flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          <h3 className="font-semibold text-lg text-purple-900 m-0">AI Copilot Analysis</h3>
          <Sparkles className="text-yellow-500 w-4 h-4 ml-auto" />
        </div>
        <div className="text-slate-700 leading-relaxed max-w-prose whitespace-pre-line">
          {loadingAi ? (
            <div className="animate-pulse flex items-center gap-2 text-purple-500 italic"><Brain className="w-4 h-4"/> Analyzing your performance trends...</div>
          ) : aiProfile ? (
            aiProfile
          ) : (
            <span className="italic text-slate-500 text-sm">Attempt more tests to unlock your AI test-taking personality report.</span>
          )}
        </div>
      </div>
"""
    # inject after <PageIntro />
    text = text.replace('subtitle="Deep dive into your accuracy and topic-wise strengths."\n      />', 'subtitle="Deep dive into your accuracy and topic-wise strengths."\n      />\n' + ai_ui)

with open("src/collab/pages/Performance.jsx", "w") as f:
    f.write(text)

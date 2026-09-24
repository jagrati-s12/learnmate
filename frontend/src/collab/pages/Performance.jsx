import { useState, useEffect } from "react";
import PageIntro from "../components/common/PageIntro";
import { TrendingUp, Target, Activity, AlertCircle, Brain, Sparkles } from "lucide-react";
import { analyticsAPI } from "../../api/analytics";

export default function Performance() {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [aiProfile, setAiProfile] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await analyticsAPI.getPerformance();
        setPerformanceData(data);
      } catch (error) {
        console.error("Failed to load performance data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();

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

  }, []);

  return (
    <div className="page">
      <PageIntro
        title="Performance Analytics"
        subtitle="Deep dive into your accuracy and topic-wise strengths."
      />

      {/* AI Test Personality */}
      <div className="card mb-6 border-2 border-[#C9A66B]/20 shadow-md bg-gradient-to-br from-[#211C18] to-[#28211C]">
        <div className="border-b border-[#C9A66B]/20 pb-4 mb-4 flex items-center gap-2">
          <Brain className="text-theme-accent-primary" size={24} />
          <h3 className="font-semibold text-lg text-theme-text-primary m-0">AI Copilot Analysis</h3>
          <Sparkles className="text-theme-accent-primary w-4 h-4 ml-auto" />
        </div>
        <div className="text-theme-text-secondary leading-relaxed max-w-prose whitespace-pre-line">
          {loadingAi ? (
            <div className="animate-pulse flex items-center gap-2 text-theme-accent-primary italic"><Brain className="w-4 h-4"/> Analyzing your performance trends...</div>
          ) : aiProfile ? (
            aiProfile
          ) : (
            <span className="italic text-theme-text-muted text-sm">Attempt more tests to unlock your AI test-taking personality report.</span>
          )}
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A66B]"></div>
        </div>
      ) : performanceData ? (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center p-6 bg-gradient-to-br from-theme-accent-primary to-[#A8895C] text-[#171411] border-none">
              <TrendingUp className="mx-auto mb-2 opacity-80" size={32} />
              <div className="text-4xl font-bold mb-1">
                {performanceData.overallScore}%
              </div>
              <div className="text-[#211C18] text-sm">Overall Score Average</div>
            </div>

            <div className="card text-center p-6 bg-gradient-to-br from-green-600 to-green-700 text-white border-none">
              <Target className="mx-auto mb-2 opacity-80" size={32} />
              <div className="text-4xl font-bold mb-1">
                {performanceData.accuracy}%
              </div>
              <div className="text-green-100 text-sm">Overall Accuracy</div>
            </div>

            <div className="card text-center p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none">
              <Activity className="mx-auto mb-2 opacity-80" size={32} />
              <div className="text-4xl font-bold mb-1">
                {performanceData.percentile}
              </div>
              <div className="text-indigo-100 text-sm">
                Estimated Percentile
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-4 border-b border-[rgba(243,237,227,0.08)] pb-4">
                <AlertCircle className="text-red-400" />
                <h3 className="font-semibold text-lg text-theme-text-primary">
                  Focus Areas (Weak Topics)
                </h3>
              </div>
              <div className="space-y-4">
                {performanceData.weakTopics.map((topic, i) => (
                  <div key={i} className="flex justify-between items-center bg-theme-bg-surface p-3 rounded-lg border border-red-500/20">
                    <div>
                      <div className="font-medium text-theme-text-primary">
                        {topic.name}
                      </div>
                      <div className="text-xs text-theme-text-muted">
                        {topic.totalAttempted} questions attempted
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-400">
                        {topic.accuracy}%
                      </div>
                      <div className="text-xs text-theme-text-muted">accuracy</div>
                    </div>
                  </div>
                ))}
                {performanceData.weakTopics.length === 0 && (
                  <div className="text-theme-text-muted text-sm py-2">No weak topics identified yet. Keep practicing!</div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4 border-b border-[rgba(243,237,227,0.08)] pb-4">
                <Target className="text-green-400" />
                <h3 className="font-semibold text-lg text-theme-text-primary">
                  Strengths
                </h3>
              </div>
              <div className="space-y-4">
                {performanceData.strongTopics.map((topic, i) => (
                  <div key={i} className="flex justify-between items-center bg-theme-bg-surface p-3 rounded-lg border border-green-500/20">
                    <div>
                      <div className="font-medium text-theme-text-primary">
                        {topic.name}
                      </div>
                      <div className="text-xs text-theme-text-muted">
                        {topic.totalAttempted} questions attempted
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        {topic.accuracy}%
                      </div>
                      <div className="text-xs text-theme-text-muted">accuracy</div>
                    </div>
                  </div>
                ))}
                {performanceData.strongTopics.length === 0 && (
                  <div className="text-theme-text-muted text-sm py-2">No strong topics identified yet. Keep practicing!</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-slate-500">Failed to load data</div>
      )}
    </div>
  );
}

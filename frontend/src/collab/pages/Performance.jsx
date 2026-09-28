import { useState, useEffect } from "react";
import PageIntro from "../components/common/PageIntro";
import { TrendingUp, Target, Activity, AlertCircle, Brain, Sparkles, Zap, Award, Flame } from "lucide-react";
import { analyticsAPI } from "../../api/analytics";
import CognitiveLoadMatrix from "../../components/analytics/CognitiveLoadMatrix";
import TopicMasteryBars from "../../components/analytics/TopicMasteryBars";
import PriorityRevisionFeed from "../../components/analytics/PriorityRevisionFeed";
import BurnoutAlertBanner from "../../components/analytics/BurnoutAlertBanner";

export default function Performance() {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [performanceOverview, setPerformanceOverview] = useState(null);
  const [topicBreakdown, setTopicBreakdown] = useState([]);
  const [aiProfile, setAiProfile] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [perf, overview, breakdown] = await Promise.all([
          analyticsAPI.getPerformance().catch(() => null),
          analyticsAPI.getPerformanceOverview().catch(() => null),
          analyticsAPI.getTopicBreakdown().catch(() => ({ topics: [] })),
        ]);

        setPerformanceData(perf);
        setPerformanceOverview(overview);
        setTopicBreakdown(breakdown?.topics || []);
      } catch (error) {
        console.error("Failed to load performance analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    const fetchAIProfile = async () => {
      try {
        setLoadingAi(true);
        const data = await analyticsAPI.getAIProfile();
        if (data && data.profile) setAiProfile(data.profile);
      } catch (error) {
        console.error('Failed to load AI profile', error);
      } finally {
        setLoadingAi(false);
      }
    };

    fetchAIProfile();
  }, []);

  const overviewSummary = performanceOverview?.overall_summary;
  const cognitiveSummary = performanceOverview?.cognitive_load_summary;
  const priorityTopics = performanceOverview?.priority_revision_topics || [];

  return (
    <div className="page space-y-6">
      <PageIntro
        title="Comprehensive Performance & Cognitive Diagnostics Engine"
        subtitle="Real-time BKT Knowledge Tracing, 2×2 Cognitive Load RTI Matrix, and Welford Burnout Analytics"
      />

      {/* Burnout Alert Banner (if anomaly detected) */}
      {overviewSummary && (
        <BurnoutAlertBanner
          burnoutRisk={overviewSummary.burnout_risk}
          scoreVelocity={overviewSummary.score_velocity}
        />
      )}

      {/* Overview Stat Highlights */}
      {overviewSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-amber-200/60 uppercase font-semibold flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" /> Student Archetype
            </span>
            <div className="text-base font-bold text-amber-100 mt-2">
              {overviewSummary.student_archetype || "The Steady Builder"}
            </div>
            <span className="text-[11px] text-amber-200/50 mt-1">Based on test consistency</span>
          </div>

          <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-amber-200/60 uppercase font-semibold flex items-center gap-1">
              <Zap className="w-4 h-4 text-emerald-400" /> Predicted Next Score
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {Math.round(overviewSummary.predicted_next_score || overviewSummary.average_score || 0)} pts
            </div>
            <span className="text-[11px] text-amber-200/50 mt-1">
              Velocity: {overviewSummary.velocity_trend} ({overviewSummary.score_velocity || 0} pts)
            </span>
          </div>

          <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-amber-200/60 uppercase font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Running Mean Score
            </span>
            <div className="text-2xl font-bold text-blue-300 mt-1">
              {Math.round(overviewSummary.average_score || 0)} pts
            </div>
            <span className="text-[11px] text-amber-200/50 mt-1">
              Std Dev: ±{Math.round(overviewSummary.running_std_dev || 0)}
            </span>
          </div>

          <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-amber-200/60 uppercase font-semibold flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> Tests Completed
            </span>
            <div className="text-2xl font-bold text-amber-200 mt-1">
              {overviewSummary.total_tests_completed || 0}
            </div>
            <span className="text-[11px] text-amber-200/50 mt-1">Welford variance tracking</span>
          </div>
        </div>
      )}

      {/* AI Copilot Analysis */}
      <div className="card border-2 border-[#C9A66B]/20 shadow-md bg-gradient-to-br from-[#211C18] to-[#28211C]">
        <div className="border-b border-[#C9A66B]/20 pb-4 mb-4 flex items-center gap-2">
          <Brain className="text-theme-accent-primary" size={24} />
          <h3 className="font-semibold text-lg text-theme-text-primary m-0">AI Diagnostic Copilot Analysis</h3>
          <Sparkles className="text-theme-accent-primary w-4 h-4 ml-auto" />
        </div>
        <div className="text-theme-text-secondary leading-relaxed max-w-prose whitespace-pre-line text-sm">
          {loadingAi ? (
            <div className="animate-pulse flex items-center gap-2 text-theme-accent-primary italic">
              <Brain className="w-4 h-4" /> Analyzing your cognitive performance trends...
            </div>
          ) : aiProfile ? (
            aiProfile
          ) : (
            <span className="italic text-theme-text-muted text-sm">
              Attempt mock tests to unlock your AI test-taking cognitive personality report.
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A66B]"></div>
        </div>
      ) : (
        <>
          {/* Cognitive Load Matrix 2x2 */}
          <CognitiveLoadMatrix summary={cognitiveSummary} />

          {/* Priority Revision Recommendations Feed */}
          <PriorityRevisionFeed topics={priorityTopics} />

          {/* Topic Mastery Tracker (BKT Engine & TMI) */}
          <TopicMasteryBars topics={topicBreakdown} />

          {/* Legacy Performance Stats Cards (if available) */}
          {performanceData && (
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-4 border-b border-[rgba(243,237,227,0.08)] pb-4">
                  <AlertCircle className="text-red-400" />
                  <h3 className="font-semibold text-lg text-theme-text-primary">
                    Subject-Level Focus Areas
                  </h3>
                </div>
                <div className="space-y-3">
                  {performanceData.weakTopics?.map((topic, i) => (
                    <div key={i} className="flex justify-between items-center bg-theme-bg-surface p-3 rounded-lg border border-red-500/20">
                      <div>
                        <div className="font-medium text-theme-text-primary text-sm">
                          {topic.name}
                        </div>
                        <div className="text-xs text-theme-text-muted">
                          {topic.totalAttempted} questions attempted
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-red-400">
                          {topic.accuracy}%
                        </div>
                        <div className="text-[11px] text-theme-text-muted">accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-4 border-b border-[rgba(243,237,227,0.08)] pb-4">
                  <Target className="text-green-400" />
                  <h3 className="font-semibold text-lg text-theme-text-primary">
                    Subject-Level Strengths
                  </h3>
                </div>
                <div className="space-y-3">
                  {performanceData.strongTopics?.map((topic, i) => (
                    <div key={i} className="flex justify-between items-center bg-theme-bg-surface p-3 rounded-lg border border-green-500/20">
                      <div>
                        <div className="font-medium text-theme-text-primary text-sm">
                          {topic.name}
                        </div>
                        <div className="text-xs text-theme-text-muted">
                          {topic.totalAttempted} questions attempted
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-green-400">
                          {topic.accuracy}%
                        </div>
                        <div className="text-[11px] text-theme-text-muted">accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Target,
  TrendingUp,
  Brain,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Activity
} from "lucide-react";
import { analyticsAPI } from "../../api/analytics";

export default function Performance() {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [syllabusData, setSyllabusData] = useState([]);
  const [aiProfile, setAiProfile] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [perfRes, progressRes] = await Promise.all([
          analyticsAPI.getPerformance().catch(() => null),
          analyticsAPI.getProgress().catch(() => [])
        ]);

        if (perfRes) setPerformanceData(perfRes);
        if (progressRes) setSyllabusData(progressRes);
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
        const data = await analyticsAPI.getAIProfile().catch(() => null);
        if (data && data.profile) setAiProfile(data.profile);
      } catch (error) {
        console.error("Failed to load AI profile", error);
      } finally {
        setLoadingAi(false);
      }
    };

    fetchAIProfile();
  }, []);

  // Consolidate subject performance list by joining perfRes (weak/strong topics) & progressRes
  const subjectPerformanceList = (() => {
    if (!performanceData && (!syllabusData || syllabusData.length === 0)) return [];

    const accuracyMap = {};
    const attemptedMap = {};

    // Combine strong and weak topics from performance endpoint
    const allPerfTopics = [
      ...(performanceData?.strongTopics || []),
      ...(performanceData?.weakTopics || [])
    ];

    allPerfTopics.forEach((t) => {
      if (t.name) {
        accuracyMap[t.name] = t.accuracy;
        attemptedMap[t.name] = t.totalAttempted;
      }
    });

    // Merge with syllabus data
    const list = syllabusData.map((sub) => {
      const name = sub.subject;
      const acc = accuracyMap[name] !== undefined ? accuracyMap[name] : null;
      const attempted = attemptedMap[name] !== undefined ? attemptedMap[name] : 0;
      return {
        name,
        accuracy: acc,
        attempted,
        progress: sub.progress
      };
    });

    // Also include any topic from performanceData not in syllabusData
    allPerfTopics.forEach((t) => {
      if (t.name && !list.some((item) => item.name === t.name)) {
        list.push({
          name: t.name,
          accuracy: t.accuracy,
          attempted: t.totalAttempted || 0,
          progress: 0
        });
      }
    });

    // Sort: subjects with accuracy first (descending accuracy), then others
    return list.sort((a, b) => {
      if (a.accuracy !== null && b.accuracy !== null) return b.accuracy - a.accuracy;
      if (a.accuracy !== null) return -1;
      if (b.accuracy !== null) return 1;
      return 0;
    });
  })();

  if (loading) {
    return (
      <div className="page max-w-6xl mx-auto px-4 py-8">
        <div className="h-20 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="h-36 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl animate-pulse" />
          <div className="h-36 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl animate-pulse" />
          <div className="h-36 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl animate-pulse" />
        </div>
        <div className="h-64 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl animate-pulse mb-8" />
      </div>
    );
  }

  const accuracyVal = performanceData?.accuracy ?? 0;
  const scoreVal = performanceData?.overallScore ?? 0;
  const percentileVal = performanceData?.percentile ?? 0;
  const weakTopics = performanceData?.weakTopics || [];

  return (
    <div className="page max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-color)] rounded-full border border-[var(--primary-color)]/20 flex items-center gap-1.5">
              <BarChart3 size={13} /> PERFORMANCE ANALYSIS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            Performance
          </h1>
          <p className="text-sm font-medium text-[var(--text-muted)] mt-1">
            Understand your strengths and the areas that need more practice.
          </p>
        </div>

        {/* Analytical Status Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-4 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl shadow-xs text-right">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Overall Status</div>
            <div className="text-sm font-black text-[var(--primary-color)]">
              {accuracyVal >= 70 ? "Strong Accuracy" : accuracyVal >= 40 ? "Moderate Accuracy" : "Needs Practice"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Overall Accuracy Card */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[var(--primary-color)]/10 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <Target size={15} className="text-[var(--primary-color)]" />
              Overall Accuracy
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-color)] px-2 py-0.5 rounded border border-[var(--primary-color)]/20">
              MOCK & PRACTICE
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-[var(--text-main)] tracking-tight">
              {accuracyVal}%
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">
              correct ratio
            </span>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)] mt-1">
            Calculated across all answered mock and practice questions.
          </p>
        </div>

        {/* Overall Score Average Card */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[var(--primary-color)]/10 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={15} className="text-[var(--primary-color)]" />
              Average Test Score
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[var(--bg-color)] text-[var(--text-main)] px-2 py-0.5 rounded border border-[var(--border-color)]">
              TEST AVERAGE
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-[var(--text-main)] tracking-tight">
              {scoreVal}
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">
              / 100 points
            </span>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)] mt-1">
            Average score achieved in completed full mock tests.
          </p>
        </div>

        {/* Estimated Percentile Card */}
        <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[var(--primary-color)]/10 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={15} className="text-[var(--primary-color)]" />
              Estimated Percentile
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary-color)] px-2 py-0.5 rounded border border-[var(--primary-color)]/20">
              BENCHMARK
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-4xl font-black text-[var(--text-main)] tracking-tight">
              {percentileVal}
              <span className="text-lg font-bold text-[var(--primary-color)]">th</span>
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">
              percentile
            </span>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)] mt-1">
            Benchmarked against historical SSC JE score distributions.
          </p>
        </div>
      </div>

      {/* 3. AI Copilot Analysis Banner */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Brain className="text-[var(--primary-color)]" size={20} />
            <h3 className="text-base font-extrabold text-[var(--text-main)]">
              AI Copilot Analysis
            </h3>
          </div>
          <Sparkles className="text-[var(--primary-color)]" size={16} />
        </div>
        <div className="text-sm font-medium text-[var(--text-main)] leading-relaxed whitespace-pre-line">
          {loadingAi ? (
            <div className="animate-pulse flex items-center gap-2 text-[var(--primary-color)] italic py-2">
              <Brain className="w-4 h-4 animate-spin" /> Analyzing your test-taking accuracy patterns...
            </div>
          ) : aiProfile ? (
            aiProfile
          ) : (
            <span className="italic text-[var(--text-muted)]">
              Attempt more questions and mock tests to generate personalized AI performance insights.
            </span>
          )}
        </div>
      </div>

      {/* 4. Subject Strength Section */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        {/* Subtle Civil Engineering Blueprint Grid Background */}
        <svg className="absolute inset-0 opacity-[0.03] pointer-events-none stroke-current text-[var(--text-main)]" width="100%" height="100%">
          <defs>
            <pattern id="blueprint-grid-perf" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid-perf)" />
        </svg>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
                <Layers className="text-[var(--primary-color)]" size={18} />
                <span>Subject Strength</span>
              </h2>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Ranked accuracy breakdown across all attempted Civil Engineering subjects.
              </p>
            </div>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              {subjectPerformanceList.length} Subjects Analyzed
            </span>
          </div>

          {subjectPerformanceList.length === 0 ? (
            <div className="text-center py-8 text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl">
              No subject performance data recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {subjectPerformanceList.map((item, idx) => {
                const hasAccuracy = item.accuracy !== null;
                const accuracy = hasAccuracy ? item.accuracy : 0;

                return (
                  <div
                    key={idx}
                    className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl transition-all duration-200 hover:border-[var(--primary-color)]/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--text-muted)] min-w-[20px]">
                          0{idx + 1}
                        </span>
                        <div>
                          <h3 className="text-sm font-extrabold text-[var(--text-main)]">
                            {item.name}
                          </h3>
                          <span className="text-xs font-medium text-[var(--text-muted)]">
                            {hasAccuracy
                              ? `${item.attempted || 0} questions attempted`
                              : "No test attempts yet"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {hasAccuracy ? (
                          <span className="text-base font-black text-[var(--primary-color)]">
                            {accuracy}%
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-[var(--text-muted)]">
                            —
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div className="w-full bg-[var(--surface-color)] border border-[var(--border-color)] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[var(--primary-color)] h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${hasAccuracy ? accuracy : 0}%`,
                          opacity: hasAccuracy ? Math.max(0.4, accuracy / 100) : 0.2
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. Needs More Practice Section */}
      <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <AlertCircle className="text-[var(--primary-color)]" size={18} />
              <span>Needs More Practice</span>
            </h2>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Topics and subjects identified with lower accuracy requiring targeted practice.
            </p>
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-color)] px-2.5 py-1 rounded-md border border-[var(--border-color)]">
            {weakTopics.length} Focus Areas
          </span>
        </div>

        {weakTopics.length === 0 ? (
          <div className="p-6 text-center bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-muted)]">
            <CheckCircle2 size={24} className="mx-auto mb-2 text-[var(--primary-color)]" />
            No weak topics flagged yet. Keep practicing questions to maintain high accuracy!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakTopics.map((topic, i) => (
              <div
                key={i}
                className="p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl flex flex-col justify-between hover:border-[var(--primary-color)]/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-extrabold text-[var(--text-main)] leading-snug">
                      {topic.name}
                    </h3>
                    <span className="px-2 py-0.5 text-[11px] font-black text-[var(--primary-color)] bg-[var(--primary-light)] rounded border border-[var(--primary-color)]/20 shrink-0">
                      {topic.accuracy}%
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[var(--text-muted)] mb-4">
                    {topic.totalAttempted} questions attempted in tests
                  </p>
                </div>

                <button
                  onClick={() => navigate("/learn/practice")}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-extrabold text-[var(--primary-color)] bg-[var(--primary-light)] hover:opacity-90 px-3 py-2 rounded-lg transition-all border border-[var(--primary-color)]/20 group"
                >
                  <span>Practice Subject</span>
                  <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

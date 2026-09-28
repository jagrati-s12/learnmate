import React, { useState } from 'react';
import { Target, Layers, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TopicMasteryBars({ topics }) {
  const [filter, setFilter] = useState('all');

  if (!topics || topics.length === 0) {
    return (
      <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-6 text-center text-amber-200/60">
        No topic mastery data recorded yet. Attempt mock tests or practice questions to start tracking.
      </div>
    );
  }

  const filteredTopics = topics.filter((t) => {
    if (filter === 'mastered') return t.bkt_mastery_prob >= 0.75;
    if (filter === 'in_progress') return t.bkt_mastery_prob >= 0.5 && t.bkt_mastery_prob < 0.75;
    if (filter === 'weak') return t.bkt_mastery_prob < 0.5;
    return true;
  });

  return (
    <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-amber-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Topic Mastery & BKT Engine Tracker
          </h3>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Bayesian Knowledge Tracing ($P(L)$) & Recency-Decayed TMI Scores
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#14100d] p-1 rounded-lg border border-[#3a312a] text-xs">
          {['all', 'mastered', 'in_progress', 'weak'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                filter === tab
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-200/60 hover:text-amber-100'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
        {filteredTopics.map((topic) => {
          const bktPct = Math.round(topic.bkt_mastery_prob * 100);
          const tmiScore = Math.round(topic.tmi_score);

          let statusBg = 'bg-rose-500/20 text-rose-300 border-rose-600/40';
          let statusLabel = 'Needs Attention';
          let barBg = 'bg-rose-500';

          if (bktPct >= 75) {
            statusBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-600/40';
            statusLabel = 'Mastered';
            barBg = 'bg-emerald-500';
          } else if (bktPct >= 50) {
            statusBg = 'bg-amber-500/20 text-amber-300 border-amber-600/40';
            statusLabel = 'In Progress';
            barBg = 'bg-amber-500';
          }

          return (
            <div
              key={topic.topic_id}
              className="bg-[#14100d] border border-[#2a231d] rounded-lg p-3.5 space-y-2 hover:border-[#4a3f35] transition-colors"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-amber-100">{topic.topic_name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusBg}`}>
                  {statusLabel} ({bktPct}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#2a231d] rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                  style={{ width: `${bktPct}%` }}
                />
              </div>

              {/* Metrics Details */}
              <div className="flex flex-wrap items-center justify-between text-xs text-amber-200/60 pt-1 border-t border-[#2a231d]/60">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> {topic.correct_count} correct
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <XCircle className="w-3.5 h-3.5" /> {topic.incorrect_count} incorrect
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span>TMI Score: <strong className="text-amber-300">{tmiScore}</strong></span>
                  {topic.quadrants && (
                    <span className="text-amber-200/50">
                      ⚡{topic.quadrants.fast_correct} | 🛡️{topic.quadrants.slow_correct} | ⚠️{topic.quadrants.fast_incorrect} | ❓{topic.quadrants.slow_incorrect}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

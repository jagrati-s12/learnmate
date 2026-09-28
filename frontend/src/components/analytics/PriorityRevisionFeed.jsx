import React from 'react';
import { AlertCircle, ArrowRight, BookOpen, Clock, Lightbulb, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PriorityRevisionFeed({ topics }) {
  const navigate = useNavigate();

  if (!topics || topics.length === 0) {
    return (
      <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-5 shadow-sm text-center text-amber-200/60">
        <p className="text-sm">🎉 No critical revision priorities found right now. Great job keeping your topic mastery high!</p>
      </div>
    );
  }

  const getRootCauseBadge = (cause) => {
    switch (cause) {
      case 'Knowledge Gap':
        return 'bg-purple-950/40 text-purple-300 border-purple-700/50';
      case 'Speed/Careless Trap':
        return 'bg-amber-950/40 text-amber-300 border-amber-700/50';
      case 'Misunderstanding':
        return 'bg-rose-950/40 text-rose-300 border-rose-700/50';
      default:
        return 'bg-blue-950/40 text-blue-300 border-blue-700/50';
    }
  };

  return (
    <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-amber-100 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Priority Revision Recommendations & Diagnostics
        </h3>
        <p className="text-xs text-amber-200/60 mt-0.5">
          Root Cause Attribution Matrix cross-referencing active study time vs BKT concept probability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((t) => (
          <div
            key={t.topic_id}
            className="bg-[#14100d] border border-[#2a231d] rounded-lg p-4 flex flex-col justify-between space-y-3 hover:border-amber-600/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400/80">
                    {t.subject_name}
                  </span>
                  <h4 className="font-semibold text-amber-100 text-sm">{t.topic_name}</h4>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-medium whitespace-nowrap ${getRootCauseBadge(
                    t.root_cause
                  )}`}
                >
                  {t.root_cause}
                </span>
              </div>

              {/* Diagnostic note */}
              <p className="text-xs text-amber-200/70 leading-relaxed bg-[#1c1612] p-2.5 rounded border border-[#2e261f]">
                {t.diagnostic_note}
              </p>

              {/* Action plan */}
              <div className="flex items-start gap-2 text-xs text-emerald-400/90 font-medium">
                <Zap className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>Action: {t.action_plan}</span>
              </div>
            </div>

            {/* Footer with hours & CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2a231d] text-xs text-amber-200/50">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {t.study_hours} hrs studied
              </span>

              <button
                onClick={() => navigate('/practice')}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-100 font-medium transition-colors"
              >
                <span>Revise Topic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

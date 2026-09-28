import React from 'react';
import { Zap, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

export default function CognitiveLoadMatrix({ summary }) {
  const {
    mastered_fast_pct = 0,
    methodical_slow_pct = 0,
    rushed_errors_pct = 0,
    conceptual_struggles_pct = 0,
  } = summary || {};

  const quadrants = [
    {
      id: 'fast_correct',
      title: 'Fast Master (Fluency)',
      pct: mastered_fast_pct,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-400',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      desc: 'High speed + High accuracy. Deep automaticity achieved.',
    },
    {
      id: 'slow_correct',
      title: 'Methodical (Deliberate)',
      pct: methodical_slow_pct,
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
      badgeBg: 'bg-blue-500/20 text-blue-400',
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      desc: 'Slow speed + High accuracy. Strong concepts, needs speed practice.',
    },
    {
      id: 'fast_incorrect',
      title: 'Speed Trap (Careless)',
      pct: rushed_errors_pct,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      badgeBg: 'bg-amber-500/20 text-amber-400',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      desc: 'High speed + Low accuracy. Rushed reading and careless mistakes.',
    },
    {
      id: 'slow_incorrect',
      title: 'High Load (Struggle)',
      pct: conceptual_struggles_pct,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
      badgeBg: 'bg-rose-500/20 text-rose-400',
      icon: <HelpCircle className="w-5 h-5 text-rose-400" />,
      desc: 'Slow speed + Low accuracy. High cognitive load & fundamental gaps.',
    },
  ];

  return (
    <div className="bg-[#1e1915] border border-[#3a312a] rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-amber-100 flex items-center gap-2">
            🧠 Cognitive Load Matrix (2×2 Pedagogical Quadrants)
          </h3>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Based on Topic-Relative Time Index (RTI) vs Accuracy performance.
          </p>
        </div>
      </div>

      {/* 2x2 Grid Plot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((q) => (
          <div
            key={q.id}
            className={`border rounded-lg p-4 transition-all duration-200 hover:scale-[1.01] ${q.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {q.icon}
                <span className="font-medium text-sm">{q.title}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.badgeBg}`}>
                {q.pct}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-black/40 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-current opacity-80"
                style={{ width: `${Math.min(100, Math.max(0, q.pct))}%` }}
              />
            </div>

            <p className="text-xs opacity-75 leading-relaxed">{q.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { AlertOctagon, HeartHandshake } from 'lucide-react';

export default function BurnoutAlertBanner({ burnoutRisk, scoreVelocity }) {
  if (!burnoutRisk || burnoutRisk === 'Normal') {
    return null;
  }

  return (
    <div className="bg-rose-950/40 border border-rose-600/60 rounded-xl p-4 text-rose-200 flex items-start gap-3 shadow-md animate-fade-in">
      <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />

      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-rose-300">Burnout Anomaly Detected!</h4>
          <span className="bg-rose-500/20 text-rose-300 text-xs px-2 py-0.5 rounded-full border border-rose-500/40 font-semibold">
            Status: {burnoutRisk}
          </span>
        </div>

        <p className="text-xs text-rose-200/80 leading-relaxed">
          Welford anomaly detection detected a performance drop below statistical tolerance thresholds (Score Velocity: {scoreVelocity || 0} pts/test). Continuing intensive mock testing while fatigued degrades concept retention.
        </p>

        <div className="flex items-center gap-2 pt-1 text-xs text-rose-300 font-medium">
          <HeartHandshake className="w-4 h-4 text-rose-400" />
          <span>Recommended Action: Take a 24-hour break or focus strictly on lightweight formula review.</span>
        </div>
      </div>
    </div>
  );
}

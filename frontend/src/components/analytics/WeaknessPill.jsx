export default function WeaknessPill({ topicName, accuracyPercent, trend }) {
  let color = 'bg-[#2a2420] text-amber-300';
  if (accuracyPercent < 40) color = 'bg-red-900/40 text-red-300 border-red-700/60';
  else if (accuracyPercent < 70) color = 'bg-amber-900/40 text-amber-300 border-amber-700/60';
  else color = 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60';

  const trendIcon = trend === 'improving' ? '↑' : trend === 'declining' ? '↓' : '→';

  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      <span>{topicName}</span>
      <span className="opacity-70">{accuracyPercent}% {trendIcon}</span>
    </span>
  );
}

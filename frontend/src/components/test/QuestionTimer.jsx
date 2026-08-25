import { useEffect } from "react";
import { Timer } from "lucide-react";
import { formatLongTime } from "./timerUtils";

export default function QuestionTimer({
  elapsedSeconds,
  onTick,
  running,
}) {
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      onTick?.();
    }, 1000);

    return () => clearInterval(interval);
  }, [running, onTick]);

  return (
    <div className="question-timer">
      <Timer size={15} />
      <span>Question time</span>
      <strong>{formatLongTime(elapsedSeconds)}</strong>
    </div>
  );
}

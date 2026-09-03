import { useEffect, useRef, useState } from "react";
import { Clock3, Pause, Play } from "lucide-react";
import { formatTime } from "./timerUtils";

export default function TestTimer({
  initialSeconds,
  running,
  onExpire,
  onTick,
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        const next = Math.max(current - 1, 0);
        onTick?.(initialSeconds - next);

        if (next === 0 && !expiredRef.current) {
          expiredRef.current = true;
          onExpire?.();
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, secondsLeft, initialSeconds, onExpire, onTick]);

  const danger = secondsLeft <= 60;
  const warning = secondsLeft <= 180 && !danger;

  return (
    <div className={`test-timer ${danger ? "danger" : warning ? "warning" : ""}`}>
      <Clock3 size={18} />
      <span>Test time</span>
      <strong>{formatTime(secondsLeft)}</strong>
    </div>
  );
}

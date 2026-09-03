import { CheckCircle2, Circle } from "lucide-react";

export default function Goal({ text, done }) {
  return (
    <div className={`goal ${done ? "done" : ""}`}>
      {done ? <CheckCircle2 size={19} /> : <Circle size={19} />}
      <span>{text}</span>
    </div>
  );
}

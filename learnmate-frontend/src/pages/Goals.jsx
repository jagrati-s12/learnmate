import { Target } from "lucide-react";
import PageIntro from "../components/common/PageIntro";
import ProgressBar from "../components/common/ProgressBar";

export default function Goals() {
  const goals = [
    ["Finish DSA by September 30", 72, "purple"],
    ["Solve 1000 Problems", 56, "blue"],
    ["Maintain 30 Days Streak", 40, "green"],
    ["Read OS Textbook", 25, "red"]
  ];

  return (
    <div className="page">
      <PageIntro title="My Goals" subtitle="Set targets and stay consistent." action="+ New Goal" />

      <div className="goal-cards">
        {goals.map(([title, progress, color]) => (
          <div className="card goal-card" key={title}>
            <div className={`goal-icon ${color}`}><Target size={20} /></div>
            <div>
              <h3>{title}</h3>
              <ProgressBar value={progress} color={color} />
              <div className="goal-meta">
                <span>{progress}% complete</span>
                <span>Due soon</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

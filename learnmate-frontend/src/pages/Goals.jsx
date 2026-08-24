import { Target } from "lucide-react";
import PageIntro from "../components/common/PageIntro";
import ProgressBar from "../components/common/ProgressBar";

export default function Goals() {
  const goals = [
    ["Complete SSC JE Civil Syllabus", 54, "purple"],
    ["Solve 1000 Civil PYQs", 43, "blue"],
    ["Finish 20 Full-Length Mocks", 30, "green"],
    ["Maintain 30 Day Study Streak", 40, "red"],
  ];

  return (
    <div className="page">
      <PageIntro
        title="SSC JE Preparation Goals"
        subtitle="Turn your exam target into measurable milestones."
        action="+ New Goal"
      />

      <div className="goal-cards">
        {goals.map(([title, progress, color]) => (
          <div className="card goal-card" key={title}>
            <div className={`goal-icon ${color}`}>
              <Target size={20} />
            </div>

            <div>
              <h3>{title}</h3>
              <ProgressBar value={progress} color={color} />

              <div className="goal-meta">
                <span>{progress}% complete</span>
                <span>Keep going</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

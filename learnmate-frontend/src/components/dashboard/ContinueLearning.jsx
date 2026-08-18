import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

export default function ContinueLearning({ subjects }) {
  return (
    <section className="card large-card">
      <div className="card-header">
        <div>
          <h3>Continue Learning</h3>
          <p>Pick up where you left off</p>
        </div>
        <NavLink to="/learn/textbook" className="text-link">
          View all <ChevronRight size={15} />
        </NavLink>
      </div>

      <div className="continue-list">
        {subjects.slice(0, 4).map((s) => (
          <div className="continue-row" key={s.name}>
            <div className={`subject-icon ${s.color}`}>{s.icon}</div>
            <div className="row-main">
              <strong>{s.name}</strong>
              <span>{s.topics} topics · {s.progress}% complete</span>
              <ProgressBar value={s.progress} color={s.color} />
            </div>
            <button className="circle-arrow">
              <ChevronRight size={17} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

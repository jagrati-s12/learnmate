import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

export default function ContinueLearning({ subjects }) {
  return (
    <section className="card large-card">
      <div className="card-header">
        <div>
          <h3>Continue SSC JE Civil</h3>
          <p>Pick up where you left off</p>
        </div>
        <NavLink to="/learn/textbook" className="text-link">
          View all <ChevronRight size={15} />
        </NavLink>
      </div>

      <div className="continue-list">
        {subjects.slice(0, 4).map((subject) => (
          <div className="continue-row" key={subject.name}>
            <div className={`subject-icon ${subject.color}`}>
              {subject.icon}
            </div>
            <div className="row-main">
              <strong>{subject.name}</strong>
              <span>{subject.topics} topics · {subject.progress}% complete</span>
              <ProgressBar value={subject.progress} color={subject.color} />
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

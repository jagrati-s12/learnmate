import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageIntro from "../common/PageIntro";
import ProgressBar from "../common/ProgressBar";
import { topics } from "../../data/data";

export default function Topics() {
  return (
    <div className="page">
      <PageIntro
        title="Civil Engineering Topics"
        subtitle="Study SSC JE Civil topics and track your preparation."
      />

      <section className="card">
        <div className="select-row">
          <label>Subject</label>
          <select>
            <option>All Civil Engineering</option>
            <option>Building Materials & Construction</option>
            <option>Surveying</option>
            <option>Soil Mechanics</option>
            <option>Hydraulics & Irrigation</option>
            <option>RCC & Steel Structures</option>
            <option>Transportation Engineering</option>
            <option>Environmental Engineering</option>
          </select>
        </div>

        <div className="tabs">
          <button className="tab active">Topics</button>
          <button className="tab">Weak Topics</button>
          <button className="tab">Completed</button>
        </div>

        <div className="topic-list">
          {topics.map(([name, progress], index) => (
            <NavLink className="topic-row" to="/learn/topic/arrays" key={name}>
              <div className="topic-number">{index + 1}</div>
              <div className="topic-info">
                <strong>{name}</strong>
                <span>{progress}% complete</span>
              </div>
              <ProgressBar value={progress} />
              <span className="topic-percent">{progress}%</span>
              <ChevronRight size={17} />
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageIntro from "../common/PageIntro";
import ProgressBar from "../common/ProgressBar";
import { subjects } from "../../data/data";

export default function MyTextbook() {
  return (
    <div className="page">
      <PageIntro title="My Textbook" subtitle="All your subjects in one place." action="+ Add Subject" />
      <div className="subject-grid">
        {subjects.map((s) => (
          <div className="subject-card card" key={s.name}>
            <div className={`subject-icon ${s.color}`}>{s.icon}</div>
            <div className="subject-card-content">
              <h3>{s.name}</h3>
              <p>{s.topics} chapters · {s.progress}% complete</p>
              <ProgressBar value={s.progress} color={s.color} />
              <div className="subject-footer">
                <span>{s.progress}%</span>
                <NavLink to="/learn/topics">
                  Continue <ChevronRight size={14} />
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

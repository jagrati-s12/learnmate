import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageIntro from "../common/PageIntro";
import ProgressBar from "../common/ProgressBar";
import { subjects } from "../../data/data";

export default function MyTextbook() {
  return (
    <div className="page">
      <PageIntro
        title="SSC JE Civil Syllabus"
        subtitle="Your Civil Engineering subjects and preparation progress."
        action="+ Add Topic"
      />

      <div className="subject-grid">
        {subjects.map((subject) => (
          <div className="subject-card card" key={subject.name}>
            <div className={`subject-icon ${subject.color}`}>
              {subject.icon}
            </div>

            <div className="subject-card-content">
              <h3>{subject.name}</h3>
              <p>{subject.topics} topics · {subject.progress}% complete</p>

              <ProgressBar value={subject.progress} color={subject.color} />

              <div className="subject-footer">
                <span>{subject.progress}%</span>
                <NavLink to="/learn/topics">
                  Study <ChevronRight size={14} />
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

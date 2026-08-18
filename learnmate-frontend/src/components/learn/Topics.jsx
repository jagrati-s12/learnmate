import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageIntro from "../common/PageIntro";
import ProgressBar from "../common/ProgressBar";
import { topics } from "../../data/data";

export default function Topics() {
  return (
    <div className="page">
      <PageIntro title="Topics" subtitle="Explore topics by subject." />
      <section className="card">
        <div className="select-row">
          <label>Subject</label>
          <select>
            <option>Data Structures & Algorithms</option>
            <option>Algorithms</option>
            <option>DBMS</option>
          </select>
        </div>

        <div className="tabs">
          <button className="tab active">Chapters</button>
          <button className="tab">All Topics</button>
        </div>

        <div className="topic-list">
          {topics.map(([name, progress], i) => (
            <NavLink className="topic-row" to="/learn/topic/arrays" key={name}>
              <div className="topic-number">{i + 1}</div>
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

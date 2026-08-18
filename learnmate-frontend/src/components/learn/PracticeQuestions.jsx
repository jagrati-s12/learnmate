import { ChevronRight, SlidersHorizontal } from "lucide-react";
import PageIntro from "../common/PageIntro";
import { questions } from "../../data/data";

export default function PracticeQuestions() {
  return (
    <div className="page">
      <PageIntro title="Practice Questions" subtitle="Strengthen your understanding through practice." />

      <section className="card">
        <div className="practice-toolbar">
          <div className="tabs">
            <button className="tab active">All</button>
            <button className="tab">Easy</button>
            <button className="tab">Medium</button>
            <button className="tab">Hard</button>
          </div>
          <button className="filter-button">
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>

        <div className="question-list">
          {questions.map(([q, d], i) => (
            <div className="question-row" key={q}>
              <span className="question-index">{i + 1}</span>
              <div>
                <strong>{q}</strong>
                <span>Arrays · Question {i + 1}</span>
              </div>
              <span className={`difficulty ${d.toLowerCase()}`}>{d}</span>
              <button className="circle-arrow"><ChevronRight size={17} /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

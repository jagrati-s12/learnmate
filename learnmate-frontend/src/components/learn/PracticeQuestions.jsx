import { ChevronRight, SlidersHorizontal } from "lucide-react";
import PageIntro from "../common/PageIntro";
import { questions } from "../../data/data";

export default function PracticeQuestions() {
  return (
    <div className="page">
      <PageIntro
        title="SSC JE Civil PYQs & Practice"
        subtitle="Practice previous-year style questions and strengthen weak areas."
      />

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
          {questions.map(([question, difficulty, subject], index) => (
            <div className="question-row" key={question}>
              <span className="question-index">{index + 1}</span>

              <div>
                <strong>{question}</strong>
                <span>{subject} · SSC JE Civil</span>
              </div>

              <span className={`difficulty ${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>

              <button className="circle-arrow">
                <ChevronRight size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

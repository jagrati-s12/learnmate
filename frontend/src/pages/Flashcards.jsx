import PageIntro from "../components/common/PageIntro";

export default function Flashcards() {
  return (
    <div className="page">
      <PageIntro
        title="SSC JE Civil Flashcards"
        subtitle="Quickly revise formulas, concepts and facts."
      />

      <section className="card flashcard">
        <span>FORMULA / CONCEPT</span>
        <h2>What is Darcy's law?</h2>
        <p>
          Recall the equation, meaning of each variable and its common
          assumptions before revealing the answer.
        </p>

        <div className="flash-actions">
          <button>✕ Again</button>
          <button>Hard</button>
          <button>Good</button>
          <button>Easy</button>
        </div>
      </section>
    </div>
  );
}

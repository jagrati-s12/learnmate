import PageIntro from "../components/common/PageIntro";

export default function Flashcards() {
  return (
    <div className="page">
      <PageIntro title="Flashcards" subtitle="Review concepts with spaced repetition." />

      <section className="card flashcard">
        <span>QUESTION</span>
        <h2>What is the time complexity of binary search?</h2>
        <p>Click to reveal the answer.</p>

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

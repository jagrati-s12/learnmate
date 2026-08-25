import { ChevronRight } from "lucide-react";

export default function TopicContent() {
  return (
    <div className="page">
      <div className="breadcrumb">
        SSC JE Civil <ChevronRight size={13} /> Soil Mechanics <ChevronRight size={13} /> Soil Properties
      </div>

      <section className="card topic-content">
        <div className="topic-content-header">
          <span className="eyebrow">SOIL MECHANICS</span>
          <h2>Soil Properties</h2>
          <p>Concepts, formulas, examples and SSC JE-focused revision.</p>
        </div>

        <div className="tabs">
          <button className="tab active">Learn</button>
          <button className="tab">Examples</button>
          <button className="tab">PYQs</button>
          <button className="tab">Summary</button>
        </div>

        <article>
          <h3>What to Learn</h3>
          <p>
            Study relationships between void ratio, porosity, degree of
            saturation, water content, specific gravity and unit weights.
          </p>

          <h3>SSC JE Focus</h3>
          <ul>
            <li>Memorize the standard relationships and definitions.</li>
            <li>Practice numerical questions involving phase diagrams.</li>
            <li>Understand saturated, partially saturated and dry soil conditions.</li>
            <li>Use dimensional checks while solving numerical problems.</li>
          </ul>

          <h3>Revision Strategy</h3>
          <p>
            Read the concept, revise the formula sheet, solve 5 basic
            numericals and then attempt previous-year questions.
          </p>
        </article>

        <div className="content-actions">
          <button className="secondary-button">← Previous</button>
          <button className="primary-button">Next →</button>
        </div>
      </section>
    </div>
  );
}

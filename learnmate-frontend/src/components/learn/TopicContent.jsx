import { ChevronRight } from "lucide-react";

export default function TopicContent() {
  return (
    <div className="page">
      <div className="breadcrumb">
        My Textbook <ChevronRight size={13} /> DSA <ChevronRight size={13} /> Arrays
      </div>

      <section className="card topic-content">
        <div className="topic-content-header">
          <span className="eyebrow">2.1 INTRODUCTION</span>
          <h2>Introduction to Arrays</h2>
          <p>Learn the concept, examples and key points.</p>
        </div>

        <div className="tabs">
          <button className="tab active">Learn</button>
          <button className="tab">Examples</button>
          <button className="tab">Notes</button>
          <button className="tab">Summary</button>
        </div>

        <article>
          <h3>Overview</h3>
          <p>
            An array is a collection of elements of the same type stored in
            contiguous memory locations. Elements can be accessed using an index.
          </p>

          <h3>Key Points</h3>
          <ul>
            <li>Arrays store multiple elements of the same data type.</li>
            <li>Elements are stored in contiguous memory locations.</li>
            <li>Indexing usually starts from 0.</li>
            <li>Accessing an element takes O(1) time.</li>
          </ul>

          <h3>Example</h3>
          <pre>{`int arr[] = {10, 20, 30, 40, 50};
int index = 2;  // 30`}</pre>
        </article>

        <div className="content-actions">
          <button className="secondary-button">← Previous</button>
          <button className="primary-button">Next →</button>
        </div>
      </section>
    </div>
  );
}

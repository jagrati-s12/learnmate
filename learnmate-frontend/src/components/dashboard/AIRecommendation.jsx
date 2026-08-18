import { NavLink } from "react-router-dom";
import { Bot } from "lucide-react";

export default function AIRecommendation() {
  return (
    <section className="card ai-card">
      <div className="ai-heading">
        <div className="ai-spark">✦</div>
        <div>
          <h3>AI Recommendation</h3>
          <p>Based on your recent activity</p>
        </div>
      </div>

      <div className="ai-message">
        <strong>Focus on Sliding Window</strong>
        <p>
          You scored 55% on your last set. I recommend reviewing the concept
          and solving 5 easy questions before moving to medium difficulty.
        </p>
      </div>

      <NavLink to="/learn/ai-tutor" className="primary-button">
        <Bot size={17} /> Ask AI Tutor
      </NavLink>
    </section>
  );
}

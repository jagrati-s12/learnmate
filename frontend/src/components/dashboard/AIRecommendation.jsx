import { NavLink } from "react-router-dom";
import { Bot } from "lucide-react";

export default function AIRecommendation() {
  return (
    <section className="card ai-card">
      <div className="ai-heading">
        <div className="ai-spark">✦</div>
        <div>
          <h3>AI Study Recommendation</h3>
          <p>Based on your SSC JE Civil activity</p>
        </div>
      </div>

      <div className="ai-message">
        <strong>Focus on Soil Mechanics</strong>
        <p>
          Your recent Soil Mechanics accuracy is lower than your Surveying
          and Transportation performance. Review soil properties, shear
          strength and bearing capacity, then solve 10 PYQs.
        </p>
      </div>

      <NavLink to="/learn/ai-tutor" className="primary-button">
        <Bot size={17} /> Ask Civil AI Tutor
      </NavLink>
    </section>
  );
}

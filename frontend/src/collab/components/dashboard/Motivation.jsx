import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Static encouragement card - copy only, no data involved.
export default function Motivation() {
  return (
    <section className="card motivation-card">
      <div className="motivation-glow" aria-hidden="true" />
      <div className="motivation-inner">
        <h3>Better Preparation.<br />Bigger Dreams.</h3>
        <p>You're doing great. Keep going, one step at a time.</p>
        <NavLink to="/track/progress" className="secondary-button">
          View Progress <ArrowRight size={14} />
        </NavLink>
      </div>
    </section>
  );
}

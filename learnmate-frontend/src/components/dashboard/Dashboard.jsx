import { NavLink } from "react-router-dom";
import { Clock3 } from "lucide-react";
import { subjects } from "../../data/data";
import DashboardStats from "./DashboardStats";
import ContinueLearning from "./ContinueLearning";
import AIRecommendation from "./AIRecommendation";
import Goal from "./Goal";
import WeeklyActivity from "./WeeklyActivity";

export default function Dashboard() {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <span className="eyebrow">PERSONALIZED LEARNING</span>
          <h2>Good morning, Arav 👋</h2>
          <p>Your AI tutor has a study plan ready for you today.</p>
        </div>

        <div className="exam-card">
          <div className="exam-icon"><Clock3 size={20} /></div>
          <div><span>Exam countdown</span><strong>42 days</strong></div>
        </div>
      </section>

      <DashboardStats />

      <div className="dashboard-grid">
        <ContinueLearning subjects={subjects} />
        <AIRecommendation />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div><h3>Today's Goals</h3><p>3 tasks remaining</p></div>
            <NavLink to="/track/goals" className="text-link">Manage</NavLink>
          </div>
          <div className="goal-list">
            <Goal text="Complete Arrays topic" done />
            <Goal text="Solve 10 practice questions" />
            <Goal text="Study for 2 hours" />
            <Goal text="Review yesterday's notes" />
          </div>
        </section>

        <WeeklyActivity />
      </div>
    </div>
  );
}

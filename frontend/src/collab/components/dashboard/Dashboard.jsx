import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardStats from "./DashboardStats";
import ContinueLearning from "./ContinueLearning";
import AIRecommendation from "./AIRecommendation";
import Goal from "./Goal";
import WeeklyActivity from "./WeeklyActivity";
import ExamCountdown from "./ExamCountdown";
import Achievements from "./Achievements";
import SubjectPerformance from "./SubjectPerformance";
import Motivation from "./Motivation";
import { useAuth } from "../../../contexts/AuthContext";
import { hierarchyAPI } from "../../../api/hierarchy";
import { goalsAPI } from "../../../api/goals";
import { analyticsAPI } from "../../../api/analytics";

// Decorative line art only - no data, no meaning attached to it.
function CivilMotif() {
  return (
    <svg className="hero-art" viewBox="0 0 260 150" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M20 118h220" opacity=".5" />
        <path d="M42 118V74l58-30 58 30v44" opacity=".55" />
        <path d="M70 118V88h20v30M110 118V88h20v30" opacity=".4" />
        <path d="M182 118V86h42v32" opacity=".45" />
        <circle cx="100" cy="44" r="5" opacity=".6" />
        <path d="M100 32v-8M100 64v-8M88 44h-8M120 44h-8" opacity=".35" />
        <path d="M148 118l14-22 14 22" opacity=".45" />
        <path d="M236 34v34M228 42h16" opacity=".3" />
      </g>
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  const [subjects, setSubjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState("");

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [hierachyData, progressData] = await Promise.all([
          hierarchyAPI.getSubjects(),
          analyticsAPI.getProgress() // from /analytics/progress
        ]);

        const colors = ["purple", "blue", "teal", "orange", "red", "cyan"];

        const authSubjects = hierachyData.slice(0, 4).map((sub, index) => {
          // Find matching progress data
          const prog = progressData.find(p => p.subject === sub.name);
          const currentProgress = prog ? prog.progress : 0;
          const currentTopics = prog ? prog.totalTopics : 0;
          const completedTopics = prog ? prog.completedTopics : 0;

          return {
            name: sub.name,
            progress: currentProgress,
            topics: currentTopics,
            completedTopics: completedTopics,
            color: colors[index % colors.length],
            icon: sub.icon || sub.name.substring(0, 2).toUpperCase()
          };
        });

        setSubjects(authSubjects);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      }
    };

    const fetchGoals = async () => {
      try {
        const data = await goalsAPI.getGoals();
        setGoals(data.slice(0, 5)); // show latest 5
      } catch (error) {
        console.error("Failed to load goals", error);
      }
    };

    fetchDependencies();
    fetchGoals();
  }, []);

  const handleToggleGoal = async (id, is_completed) => {
    try {
      const updated = await goalsAPI.updateGoal(id, is_completed);
      setGoals(goals.map(g => g.id === id ? updated : g));
    } catch(err) {}
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    try {
      const g = await goalsAPI.createGoal(newGoalText);
      setGoals([g, ...goals].slice(0, 5));
      setNewGoalText("");
    } catch(err) {}
  };

  const handleDeleteGoal = async (id) => {
    try {
      await goalsAPI.deleteGoal(id);
      setGoals(goals.filter(g => g.id !== id));
    } catch(err) {}
  };

  const remainingGoals = goals.filter(g => !g.is_completed).length;

  return (
    <div className="page dashboard-page">
      {/* LEVEL 1 - Welcome + countdown */}
      <section className="hero hero-card">
        <CivilMotif />

        <div className="hero-text">
          <span className="eyebrow">SSC JE CIVIL • PERSONALIZED PREPARATION</span>
          <h2>Good morning, {firstName} 👋</h2>
          <p>Let's crack SSC JE Civil today. Focus on your weakest topics first.</p>

          <div className="hero-cta">
            <NavLink to="/learn/textbook" className="primary-button hero-button">
              Continue Preparation <ArrowRight size={15} />
            </NavLink>
            <span className="hero-hint">
              {remainingGoals > 0
                ? `${remainingGoals} task${remainingGoals > 1 ? "s" : ""} left today`
                : "Plan today's tasks below"}
            </span>
          </div>
        </div>

        <div className="hero-right">
          <ExamCountdown />
        </div>
      </section>

      {/* LEVEL 2 - Four key statistics */}
      <DashboardStats />

      {/* LEVEL 3 - Continue learning + today's focus */}
      <div className="dashboard-grid">
        <ContinueLearning subjects={subjects} />
        <AIRecommendation />
      </div>

      {/* LEVEL 4 - Study plan + activity */}
      <div className="dashboard-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h3>Today's Study Plan</h3>
              <p>{remainingGoals} tasks remaining</p>
            </div>
            <NavLink to="/track/goals" className="text-link">
              Manage
            </NavLink>
          </div>

          <form onSubmit={handleAddGoal} className="goal-add-form">
            <input
              type="text"
              className="goal-input"
              placeholder="Add a new goal..."
              value={newGoalText}
              onChange={e => setNewGoalText(e.target.value)}
            />
            <button className="primary-button text-sm whitespace-nowrap">Add</button>
          </form>

          <div className="goal-list">
            {goals.map(g => (
              <Goal
                key={g.id}
                goal={g}
                onToggle={handleToggleGoal}
                onDelete={handleDeleteGoal}
              />
            ))}
            {goals.length === 0 && (
              <div className="mini-empty compact">
                <p>Nothing planned yet</p>
                <span>Add a task above to start your day.</span>
              </div>
            )}
          </div>
        </section>

        <WeeklyActivity />
      </div>

      {/* LEVEL 5 - Achievements, subject performance, motivation */}
      <div className="dashboard-grid">
        <Achievements />
        <SubjectPerformance />
        <Motivation />
      </div>
    </div>
  );
}

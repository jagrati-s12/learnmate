import { Brain, Trophy, Clock3, Flame } from "lucide-react";
import PageIntro from "../common/PageIntro";
import StatCard from "../common/StatCard";

export default function SimpleTrack({ title, subtitle, type }) {
  return (
    <div className="page">
      <PageIntro title={title} subtitle={subtitle} />

      <section className="stats-grid">
        <StatCard icon={<Brain />} label="PYQs Completed" value="428" sub="+36 this week" />
        <StatCard icon={<Trophy />} label="Civil Accuracy" value="76%" sub="+4% this week" />
        <StatCard icon={<Clock3 />} label="Avg. Question Time" value="2m 48s" sub="-12s this week" />
        <StatCard icon={<Flame />} label="Study Streak" value="12 days" sub="Personal best: 18" />
      </section>

      <section className="card">
        <h3>
          {type === "calendar"
            ? "SSC JE Study Calendar"
            : "SSC JE Performance Overview"}
        </h3>

        <div className="big-placeholder">
          {type === "calendar"
            ? "📅 Your study calendar will appear here"
            : "📈 Civil subject-wise accuracy and mock-test graph will appear here"}
        </div>
      </section>
    </div>
  );
}

import { Brain, Trophy, Clock3, Flame } from "lucide-react";
import PageIntro from "../common/PageIntro";
import StatCard from "../common/StatCard";

export default function SimpleTrack({ title, subtitle, type }) {
  return (
    <div className="page">
      <PageIntro title={title} subtitle={subtitle} />

      <section className="stats-grid">
        <StatCard icon={<Brain />} label="Questions Completed" value="248" sub="+28 this week" />
        <StatCard icon={<Trophy />} label="Accuracy" value="76%" sub="+4% this week" />
        <StatCard icon={<Clock3 />} label="Avg. Time" value="2m 48s" sub="-12s this week" />
        <StatCard icon={<Flame />} label="Current Streak" value="12 days" sub="Personal best: 18" />
      </section>

      <section className="card">
        <h3>{type === "calendar" ? "Study Calendar" : "Performance Overview"}</h3>
        <div className="big-placeholder">
          {type === "calendar"
            ? "📅 Calendar component goes here"
            : "📈 Recharts performance graph goes here"}
        </div>
      </section>
    </div>
  );
}

import { BookOpen, Clock3, Brain, Flame } from "lucide-react";
import StatCard from "../common/StatCard";

export default function DashboardStats() {
  return (
    <section className="stats-grid">
      <StatCard icon={<BookOpen />} label="Overall Progress" value="68%" sub="+6% this week" />
      <StatCard icon={<Clock3 />} label="Study Time" value="248h 30m" sub="This semester" />
      <StatCard icon={<Brain />} label="Questions Solved" value="248" sub="+32 this week" />
      <StatCard icon={<Flame />} label="Study Streak" value="12 days" sub="Keep it going!" />
    </section>
  );
}

import { BookOpen, Clock3, Brain, Flame } from "lucide-react";
import StatCard from "../common/StatCard";

export default function DashboardStats() {
  return (
    <section className="stats-grid">
      <StatCard icon={<BookOpen />} label="Civil Syllabus" value="54%" sub="+7% this week" />
      <StatCard icon={<Clock3 />} label="Study Time" value="248h 30m" sub="This preparation cycle" />
      <StatCard icon={<Brain />} label="PYQs Solved" value="428" sub="+36 this week" />
      <StatCard icon={<Flame />} label="Study Streak" value="12 days" sub="Keep it going!" />
    </section>
  );
}

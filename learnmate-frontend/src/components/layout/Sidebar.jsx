import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Layers3, Brain, Bot, BarChart3,
  Trophy, CalendarDays, Target, FileText, Bookmark, MessageCircle,
  UserRound, SlidersHorizontal, Shield, X
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { section: "LEARN" },
  { label: "My Textbook", icon: BookOpen, to: "/learn/textbook" },
  { label: "Topics", icon: Layers3, to: "/learn/topics" },
  { label: "Practice Questions", icon: Brain, to: "/learn/practice" },
  { label: "AI Tutor", icon: Bot, to: "/learn/ai-tutor" },
  { section: "TRACK" },
  { label: "Progress", icon: BarChart3, to: "/track/progress" },
  { label: "Performance", icon: Trophy, to: "/track/performance" },
  { label: "Calendar", icon: CalendarDays, to: "/track/calendar" },
  { label: "Goals", icon: Target, to: "/track/goals" },
  { section: "RESOURCES" },
  { label: "Notes", icon: FileText, to: "/resources/notes" },
  { label: "Bookmarks", icon: Bookmark, to: "/resources/bookmarks" },
  { label: "Flashcards", icon: Layers3, to: "/resources/flashcards" },
  { label: "Doubt Solver", icon: MessageCircle, to: "/resources/doubt-solver" },
  { section: "SETTINGS" },
  { label: "Profile", icon: UserRound, to: "/settings/profile" },
  { label: "Preferences", icon: SlidersHorizontal, to: "/settings/preferences" },
  { label: "Security", icon: Shield, to: "/settings/security" }
];

export default function Sidebar({ open, setOpen }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">✦</div>
        <div>
          <strong>LearnMate</strong>
          <span>AI Learning Platform</span>
        </div>
        <button className="mobile-close" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </div>

      <nav>
        {nav.map((item, i) =>
          item.section ? (
            <div className="nav-section" key={i}>{item.section}</div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">AS</div>
        <div>
          <strong>Arav Sharma</strong>
          <span>Student</span>
        </div>
      </div>
    </aside>
  );
}

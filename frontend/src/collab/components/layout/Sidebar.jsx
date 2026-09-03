import { NavLink } from "react-router-dom";
import {LayoutDashboard,BookOpen,
  Layers3,
  Brain,
  Bot,
  Clock3,
  BarChart3,
  Trophy,
  CalendarDays,
  Target,
  FileText,
  Bookmark,
  MessageCircle,
  UserRound,
  SlidersHorizontal,
  Shield,
  X,
  Settings
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const getNav = (isAdmin) => [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  ...(isAdmin ? [{ label: "Admin Panel", icon: Settings, to: "/admin/dashboard" }] : []),
  { section: "LEARN" },
  { label: "Civil Syllabus", icon: BookOpen, to: "/learn/textbook" },
  { label: "Civil Topics", icon: Layers3, to: "/learn/topics" },
{ label: "PYQs & Practice", icon: Brain, to: "/learn/practice" },
{ label: "Mock Test", icon: Clock3, to: "/test/mock" },
{ label: "Civil AI Tutor", icon: Bot, to: "/learn/ai-tutor" },
  { section: "TRACK" },
  { label: "Progress", icon: BarChart3, to: "/track/progress" },
  { label: "Performance", icon: Trophy, to: "/track/performance" },
  { label: "Study Calendar", icon: CalendarDays, to: "/track/calendar" },
  { label: "Preparation Goals", icon: Target, to: "/track/goals" },
  { section: "RESOURCES" },
  { label: "Civil Notes", icon: FileText, to: "/resources/notes" },
  { label: "Saved Resources", icon: Bookmark, to: "/resources/bookmarks" },
  { label: "Flashcards", icon: Layers3, to: "/resources/flashcards" },
  { label: "Doubt Solver", icon: MessageCircle, to: "/resources/doubt-solver" },
  { section: "SETTINGS" },
  { label: "Profile", icon: UserRound, to: "/settings/profile" },
  { label: "Study Preferences", icon: SlidersHorizontal, to: "/settings/preferences" },
  { label: "Security", icon: Shield, to: "/settings/security" }
];

export default function Sidebar({ open, setOpen }) {
  const { user } = useAuth();
  const nav = getNav(user?.is_admin);

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">✦</div>
        <div>
          <strong>LearnMate</strong>
          <span>SSC JE Civil Prep</span>
        </div>
        <button className="mobile-close" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </div>

      <nav>
        {nav.map((item, index) =>
          item.section ? (
            <div className="nav-section" key={index}>{item.section}</div>
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
        <div className="avatar">{user?.full_name?.charAt(0) || 'U'}</div>
        <div>
          <strong>{user?.full_name || 'User'}</strong>
          <span>{user?.email}</span>
        </div>
      </div>
    </aside>
  );
}

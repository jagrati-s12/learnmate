import { Menu, Search, Bell, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title, setOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setOpen(true)}>
        <Menu />
      </button>

      <div>
        <h1>{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
        <p>Prepare smarter. Crack SSC JE Civil.</p>
      </div>

      <div className="top-actions">
        <button className="icon-button" onClick={() => alert("Search functionality coming soon!")}><Search size={18} /></button>
        <button className="icon-button notification" onClick={() => alert("You have no new notifications.")}>
          <Bell size={18} />
          <span />
        </button>
        <button
          className="icon-button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-button" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
        <div className="top-avatar cursor-pointer" onClick={() => navigate("/settings/profile")} title={user?.full_name}>{user?.full_name?.charAt(0) || 'U'}</div>
      </div>
    </header>
  );
}

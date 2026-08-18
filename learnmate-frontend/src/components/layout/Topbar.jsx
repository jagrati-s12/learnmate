import { Menu, Search, Bell } from "lucide-react";

export default function Topbar({ title, setOpen }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setOpen(true)}>
        <Menu />
      </button>

      <div>
        <h1>{title.charAt(0).toUpperCase() + title.slice(1)}</h1>
        <p>Learn smarter. Make progress every day.</p>
      </div>

      <div className="top-actions">
        <button className="icon-button"><Search size={18} /></button>
        <button className="icon-button notification">
          <Bell size={18} />
          <span />
        </button>
        <div className="top-avatar">AS</div>
      </div>
    </header>
  );
}

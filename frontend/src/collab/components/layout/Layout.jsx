import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children = null }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const title =
    location.pathname === "/" || location.pathname === "/dashboard"
      ? "Dashboard"
      : location.pathname
          .split("/")
          .filter(Boolean)
          .pop()
          ?.replaceAll("-", " ") || "Dashboard";

  return (
    <div className="app-shell">
      <Sidebar open={open} setOpen={setOpen} />

      <main className="main">
        <Topbar title={title} setOpen={setOpen} />
        {children || <Outlet />}
      </main>
    </div>
  );
}

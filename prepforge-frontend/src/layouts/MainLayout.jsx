import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./MainLayout.css";

export default function MainLayout() {
  // Sidebar is a fixed rail on desktop and a slide-in panel on mobile.
  // This single boolean drives both, kept simple on purpose (see brief:
  // "Do not create a complicated mobile navigation system").
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

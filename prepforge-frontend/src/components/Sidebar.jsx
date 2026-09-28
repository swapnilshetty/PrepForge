import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Code2,
  MessagesSquare,
  TrendingUp,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/practice", label: "Practice", icon: Target },
  { to: "/coding", label: "Coding", icon: Code2 },
  { to: "/interviews", label: "Interviews", icon: MessagesSquare },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

const FOOT_ITEMS = [
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose();
    navigate("/login");
  }
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="sidebar-brand">
          <Logo />
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
              onClick={onClose}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
  {FOOT_ITEMS.map(({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `sidebar-link${isActive ? " active" : ""}`
      }
      onClick={onClose}
    >
      <Icon size={18} strokeWidth={2} />
      {label}
    </NavLink>
  ))}

  <button
    type="button"
    className="sidebar-link sidebar-logout"
    onClick={handleLogout}
  >
    <LogOut size={18} strokeWidth={2} />
    Logout
  </button>
</div>
      </aside>
    </>
  );
}

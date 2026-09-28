import { Menu } from "lucide-react";
import Logo from "./Logo";
import "./Header.css";

export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button
        className="header-menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>
      <span className="header-mobile-mark">
        <Logo compact />
      </span>
    </header>
  );
}

import "./Logo.css";

// Original mark: a chamfered square (the same clipped-corner language used
// on "forged" cards throughout the app) with a small ember spark in the
// cut corner. No external logo asset.
export default function Logo({ compact = false }) {
  return (
    <div className="logo">
      <svg className="logo-mark" width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <polygon points="8,0 26,0 26,26 0,26 0,8" fill="var(--ink)" />
        <circle cx="6.5" cy="6.5" r="3" fill="var(--ember)" />
      </svg>
      {!compact && <span className="logo-word">PrepForge</span>}
    </div>
  );
}

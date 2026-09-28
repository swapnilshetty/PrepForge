import "./StatCard.css";

export default function StatCard({ icon, title, value, suffix }) {
  return (
    <div className="card card--forged stat-card">
      <div className="stat-card-head">
        <span className="stat-card-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="stat-card-title">{title}</span>
      </div>
      <div className="stat-card-figure">
        {value}
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
}

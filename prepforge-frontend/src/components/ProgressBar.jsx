import { getHeatColor, formatPercent } from "../utils/formatters";
import "./ProgressBar.css";

export default function ProgressBar({ label, percent = 0 }) {
  const safePercent = Math.max(0, Math.min(100, percent || 0));

  return (
    <div className="heat-bar">
      <div className="heat-bar-head">
        <span className="heat-bar-label">{label}</span>
        <span className="heat-bar-value">{formatPercent(safePercent)}</span>
      </div>
      <div
        className="heat-bar-track"
        role="progressbar"
        aria-valuenow={Math.round(safePercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="heat-bar-fill"
          style={{
            width: `${safePercent}%`,
            backgroundColor: getHeatColor(safePercent),
          }}
        />
      </div>
    </div>
  );
}

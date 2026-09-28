import "./Badge.css";

// variant controls the color. Callers pick a variant explicitly rather
// than this component guessing from the label text, so it stays usable
// for difficulty, status, and question-type badges alike.
export default function Badge({ children, variant = "neutral" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

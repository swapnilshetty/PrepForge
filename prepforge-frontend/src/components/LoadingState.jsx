import "./States.css";

export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="state-block">
      <div className="state-loading-row">
        <span className="state-spinner" aria-hidden="true" />
        <p>{label}</p>
      </div>
    </div>
  );
}

import "./States.css";

export default function ErrorState({
  message = "Unable to load data. Please try again.",
  onRetry,
}) {
  return (
    <div className="state-block state-block--error">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

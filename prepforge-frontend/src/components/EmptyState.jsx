import "./States.css";

export default function EmptyState({ message = "Nothing here yet.", action }) {
  return (
    <div className="state-block state-block--center">
      <p>{message}</p>
      {action}
    </div>
  );
}

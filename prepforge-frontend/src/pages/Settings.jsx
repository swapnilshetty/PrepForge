import EmptyState from "../components/EmptyState";

// The brief asks for a "Settings" link in the sidebar footer but doesn't
// specify any fields or an API for it. Rather than invent fake settings
// that don't actually save anywhere, this page is an honest placeholder.
export default function Settings() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Settings</h1>
        <p>Account and preference settings.</p>
      </div>
      <EmptyState message="Settings aren't available yet — this section is waiting on backend support." />
    </div>
  );
}

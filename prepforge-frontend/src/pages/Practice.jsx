import { Link } from "react-router-dom";
import { Code2, Mic } from "lucide-react";
import Badge from "../components/Badge";
import "./Practice.css";

// The brief lists "Practice" and "Coding" as separate sidebar items but
// only specs an API for Coding. This page treats Practice as a small hub
// that points at the practice modes that actually exist (Coding today,
// Mock Interviews once that future feature is built) rather than
// duplicating the Coding page under a second route.
export default function Practice() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Practice</h1>
        <p>Pick a practice mode to sharpen a specific skill.</p>
      </div>

      <div className="practice-grid">
        <Link to="/coding" className="card practice-card">
          <Code2 size={22} />
          <h3>Coding practice</h3>
          <p>Work through problems filtered by difficulty and topic.</p>
        </Link>

        <div className="card practice-card practice-card--disabled">
          <Mic size={22} />
          <h3>Mock interviews</h3>
          <p>Simulated interview sessions with feedback.</p>
          <span className="practice-card-tag">
            <Badge variant="neutral">Coming soon</Badge>
          </span>
        </div>
      </div>
    </div>
  );
}

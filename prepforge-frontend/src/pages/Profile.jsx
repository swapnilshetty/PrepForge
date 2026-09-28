import { useApi } from "../hooks/useApi";
import { getDashboard } from "../services/dashboardService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import { BookOpen, Code2, MessagesSquare } from "lucide-react";
import "./Profile.css";

// There's no dedicated /api/profile/ endpoint in the brief, so this page
// reuses GET /api/dashboard/ for the username and stats it already
// returns. If a real profile endpoint gets added later (avatar, bio,
// etc.), swap the call here — the rest of the page won't need to change.
export default function Profile() {
  const { data, loading, error, reload } = useApi(() => getDashboard(), []);

  if (loading) return <div className="page"><LoadingState /></div>;
  if (error)
    return (
      <div className="page">
        <ErrorState onRetry={reload} />
      </div>
    );

  const username = data?.user?.username || "there";
  const coding = data?.coding || {};
  const interview = data?.interviews || {};
  const learning = data?.learning || {};
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="page">
      <div className="profile-header">
        <div className="profile-avatar" aria-hidden="true">
          {initial}
        </div>
        <div>
          <h1 style={{ marginBottom: 2 }}>{username}</h1>
          <p className="text-muted" style={{ marginBottom: 0 }}>
            PrepForge learner
          </p>
        </div>
      </div>

      <section className="profile-section">
        <h3>Progress summary</h3>
        <div className="card" style={{ padding: 22 }}>
          <ProgressBar
            label="Overall progress"
            percent={data?.overall_progress ?? 0}
          />
        </div>
      </section>

      <section className="profile-section">
        <h3>Statistics</h3>
        <div className="profile-stat-row">
          <StatCard
            icon={<BookOpen size={16} />}
            title="Learning categories"
            value={learning.total_categories ?? 0}
          />
          <StatCard
            icon={<Code2 size={16} />}
            title="Coding solved"
            value={coding.solved ?? 0}
            suffix={`/ ${coding.total_problems ?? 0}`}
          />
          <StatCard
            icon={<MessagesSquare size={16} />}
            title="Interview answered"
            value={interview.answered ?? 0}
            suffix={`/ ${interview.total_questions ?? 0}`}
          />
        </div>
      </section>
    </div>
  );
}

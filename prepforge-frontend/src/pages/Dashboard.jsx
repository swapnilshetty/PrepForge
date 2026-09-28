import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Code2,
  MessagesSquare,
  Flame,
  ArrowRight,
} from "lucide-react";

import { useApi } from "../hooks/useApi";
import { getDashboard } from "../services/dashboardService";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import Badge from "../components/Badge";

import { difficultyLabel } from "../utils/formatters";

import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    data,
    loading,
    error,
    reload,
  } = useApi(() => getDashboard(), []);

  if (loading) {
    return (
      <div className="page dashboard-page">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page dashboard-page">
        <ErrorState onRetry={reload} />
      </div>
    );
  }

  const learning = data?.learning || {};
  const coding = data?.coding || {};
  const interview = data?.interviews || {};
  const activity = data?.recent_coding_activity || [];

  const overallProgress = Number(data?.overall_progress || 0);
  const codingProgress = Number(
    coding?.progress_percentage || 0
  );
  const interviewProgress = Number(
    interview?.progress_percentage || 0
  );

  return (
    <div className="page dashboard-page">

      {/* =========================
          Header
      ========================= */}

      <div className="dashboard-header">
        <div>
          <h1 className="dash-greeting">
            Welcome back, {data?.user?.username || "there"}
          </h1>

          <p className="dash-sub">
            Here's where your preparation stands today.
          </p>
        </div>
      </div>

      {/* =========================
          Statistics
      ========================= */}

      <div className="stat-grid">

        <StatCard
          icon={<BookOpen size={16} />}
          title="Learning"
          value={learning.total_categories ?? 0}
          suffix="categories"
        />

        <StatCard
          icon={<Code2 size={16} />}
          title="Coding"
          value={coding.solved ?? 0}
          suffix={`/ ${coding.total_problems ?? 0} solved`}
        />

        <StatCard
          icon={<MessagesSquare size={16} />}
          title="Interviews"
          value={interview.answered ?? 0}
          suffix={`/ ${interview.total_questions ?? 0} prepared`}
        />

        <StatCard
          icon={<Flame size={16} />}
          title="Overall Progress"
          value={Math.round(overallProgress)}
          suffix="%"
        />

      </div>

      {/* =========================
          Progress Overview
      ========================= */}

      <section className="dash-section">

        <div className="card dash-progress-card">

          <div className="dash-progress-title">
            <div>
              <h2>Preparation Progress</h2>

              <p>
                Keep building your skills across every area.
              </p>
            </div>

            <span className="dash-overall-percent">
              {Math.round(overallProgress)}%
            </span>
          </div>

          <div className="dash-progress-grid">

            <ProgressBar
              label="Overall progress"
              percent={overallProgress}
            />

            <ProgressBar
              label="Coding progress"
              percent={codingProgress}
            />

            <ProgressBar
              label="Interview progress"
              percent={interviewProgress}
            />

          </div>

        </div>

      </section>

      {/* =========================
          Main Breakdown
      ========================= */}

      <section className="dash-breakdown">

        {/* Coding */}

        <div className="card dash-breakdown-card">

          <div className="dash-card-header">

            <div>
              <h2>Coding</h2>
              <p>
                Build problem-solving skills through practice.
              </p>
            </div>

            <Code2 size={22} />

          </div>

          <div className="dash-mini-stats">

            <div className="dash-mini-stat">
              <strong>
                {coding.total_problems ?? 0}
              </strong>

              <span>
                Total problems
              </span>
            </div>

            <div className="dash-mini-stat">
              <strong>
                {coding.solved ?? 0}
              </strong>

              <span>
                Solved
              </span>
            </div>

            <div className="dash-mini-stat">
              <strong>
                {coding.attempted ?? 0}
              </strong>

              <span>
                Attempted
              </span>
            </div>

          </div>

          <div className="dash-activity-list">

            {activity.length === 0 ? (
              <div className="dash-empty">
                <p>
                  Your coding journey starts here.
                </p>
              </div>
            ) : (
              activity.map((item) => (
                <div
                  className="dash-activity-row"
                  key={item.id}
                >

                  <div className="dash-activity-info">

                    <span className="dash-activity-title">
                      {item.problem_title}
                    </span>

                    <span className="dash-activity-date">
                      {item.solved_at || "Attempted"}
                    </span>

                  </div>

                  <Badge
                    variant={
                      (item.difficulty || "").toLowerCase()
                    }
                  >
                    {difficultyLabel(item.difficulty)}
                  </Badge>

                </div>
              ))
            )}

          </div>

          <button
            className="btn btn-primary dash-action"
            onClick={() => navigate("/coding")}
          >
            Start Practicing
            <ArrowRight size={16} />
          </button>

        </div>

        {/* Interviews */}

        <div className="card dash-breakdown-card">

          <div className="dash-card-header">

            <div>
              <h2>Interviews</h2>

              <p>
                Prepare for technical and behavioral interviews.
              </p>
            </div>

            <MessagesSquare size={22} />

          </div>

          <div className="dash-mini-stats">

            <div className="dash-mini-stat">
              <strong>
                {interview.total_questions ?? 0}
              </strong>

              <span>
                Total questions
              </span>
            </div>

            <div className="dash-mini-stat">
              <strong>
                {interview.answered ?? 0}
              </strong>

              <span>
                Prepared
              </span>
            </div>

          </div>

          <div className="dash-interview-progress">

            <ProgressBar
              label="Interview preparation"
              percent={interviewProgress}
            />

          </div>

          <div className="dash-learning-note">

            <BookOpen size={18} />

            <p>
              <strong>
                {learning.total_content ?? 0}
              </strong>{" "}
              learning lessons available across{" "}
              <strong>
                {learning.total_categories ?? 0}
              </strong>{" "}
              categories.
            </p>

          </div>

          <button
            className="btn btn-primary dash-action"
            onClick={() => navigate("/interviews")}
          >
            Practice Interviews
            <ArrowRight size={16} />
          </button>

        </div>

      </section>

      {/* =========================
          Quick Actions
      ========================= */}

      <section className="dash-quick-section">

        <div className="dash-section-heading">
          <div>
            <h2>Continue Preparing</h2>

            <p>
              Choose an area and keep your momentum going.
            </p>
          </div>
        </div>

        <div className="dash-quick-grid">

          <button
            className="card dash-quick-card"
            onClick={() => navigate("/learn")}
          >
            <BookOpen size={22} />

            <div>
              <h3>Learn</h3>
              <p>
                Study interview-focused concepts.
              </p>
            </div>

            <ArrowRight size={18} />

          </button>

          <button
            className="card dash-quick-card"
            onClick={() => navigate("/coding")}
          >
            <Code2 size={22} />

            <div>
              <h3>Practice Coding</h3>
              <p>
                Solve coding problems and track attempts.
              </p>
            </div>

            <ArrowRight size={18} />

          </button>

          <button
            className="card dash-quick-card"
            onClick={() => navigate("/interviews")}
          >
            <MessagesSquare size={22} />

            <div>
              <h3>Interview Prep</h3>
              <p>
                Prepare technical and behavioral answers.
              </p>
            </div>

            <ArrowRight size={18} />

          </button>

        </div>

      </section>

    </div>
  );
}
import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Target,
  Trophy,
  RefreshCw,
} from "lucide-react";

import { getProgress } from "../services/dashboardService";
import { getCodingProgress } from "../services/codingService";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import "./Progress.css";


export default function Progress() {
  const [data, setData] = useState(null);
  const [codingData, setCodingData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  /* =========================================================
     LOAD PROGRESS
     ========================================================= */

  async function loadProgress() {
    try {
      setLoading(true);
      setError(null);

      const [progress, coding] = await Promise.all([
        getProgress(),
        getCodingProgress(),
      ]);

      setData(progress);
      setCodingData(coding);

    } catch (error) {
      console.error("Failed to load progress:", error);
      setError(error);

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadProgress();
  }, []);


  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="page">
        <LoadingState />
      </div>
    );
  }


  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <div className="page">
        <ErrorState onRetry={loadProgress} />
      </div>
    );
  }


  /* =========================================================
     DATA
     ========================================================= */

  const summary = codingData?.summary || {};
  const problems = codingData?.problems || [];

  const lessonsCompleted =
    data?.lessons_completed || 0;

  const questionsSolved =
    data?.questions_solved || 0;

  const codingSolved =
    data?.coding_solved || 0;

  const codingAttempted =
    data?.coding_attempted || 0;

  const interviewsPrepared =
    data?.interviews_prepared || 0;

  const progressPercentage =
    Math.min(
      100,
      Math.max(
        0,
        Number(summary.progress_percentage || 0)
      )
    );


  return (
    <div className="page">


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="progress-page-header">

        <div>

          <div className="progress-eyebrow">
            <Target size={15} />
            Your preparation journey
          </div>

          <h1>Progress</h1>

          <p>
            Track your interview preparation and see
            how far you've come.
          </p>

        </div>


        <button
          type="button"
          className="btn btn-secondary progress-refresh"
          onClick={loadProgress}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* =====================================================
          PREPARATION OVERVIEW
          ===================================================== */}

      <section className="progress-section">

        <div className="section-heading">

          <div>
            <h2>Preparation Overview</h2>

            <p>
              Your activity across PrepForge.
            </p>
          </div>

        </div>


        <div className="overview-grid">


          {/* LESSONS */}

          <div className="progress-overview-card">

            <div className="overview-icon">
              <BookOpen size={20} />
            </div>

            <div className="overview-content">

              <span className="stat-value">
                {lessonsCompleted}
              </span>

              <span className="stat-label">
                Lessons Completed
              </span>

            </div>

          </div>


          {/* QUESTIONS */}

          <div className="progress-overview-card">

            <div className="overview-icon">
              <CheckCircle2 size={20} />
            </div>

            <div className="overview-content">

              <span className="stat-value">
                {questionsSolved}
              </span>

              <span className="stat-label">
                Questions Solved
              </span>

            </div>

          </div>


          {/* CODING */}

          <div className="progress-overview-card">

            <div className="overview-icon">
              <Code2 size={20} />
            </div>

            <div className="overview-content">

              <span className="stat-value">
                {codingSolved}
              </span>

              <span className="stat-label">
                Coding Problems Solved
              </span>

            </div>

          </div>


          {/* INTERVIEWS */}

          <div className="progress-overview-card">

            <div className="overview-icon">
              <Trophy size={20} />
            </div>

            <div className="overview-content">

              <span className="stat-value">
                {interviewsPrepared}
              </span>

              <span className="stat-label">
                Interviews Prepared
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CODING PROGRESS
          ===================================================== */}

      <section className="progress-section">

        <div className="section-heading">

          <div>

            <h2>Coding Progress</h2>

            <p>
              Your progress through the coding problem set.
            </p>

          </div>

          <strong className="progress-percentage">
            {progressPercentage}%
          </strong>

        </div>


        {/* PROGRESS BAR */}

        <div className="progress-track">

          <div
            className="progress-bar-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          />

        </div>


        {/* CODING STATS */}

        <div className="coding-stats">


          <div className="coding-stat">

            <span className="coding-stat-value">
              {summary.total_problems || 0}
            </span>

            <span className="coding-stat-label">
              Total Problems
            </span>

          </div>


          <div className="coding-stat">

            <span className="coding-stat-value">
              {codingAttempted}
            </span>

            <span className="coding-stat-label">
              Attempted
            </span>

          </div>


          <div className="coding-stat">

            <span className="coding-stat-value">
              {codingSolved}
            </span>

            <span className="coding-stat-label">
              Solved
            </span>

          </div>


          <div className="coding-stat">

            <span className="coding-stat-value">
              {summary.total_attempts || 0}
            </span>

            <span className="coding-stat-label">
              Total Attempts
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROBLEM ACTIVITY
          ===================================================== */}

      <section className="progress-section">

        <div className="section-heading">

          <div>

            <h2>Problem Activity</h2>

            <p>
              Your recent coding practice.
            </p>

          </div>

          {problems.length > 0 && (
            <span className="activity-count">
              {problems.length}{" "}
              {problems.length === 1
                ? "problem"
                : "problems"}
            </span>
          )}

        </div>


        {problems.length === 0 ? (

          <div className="progress-empty">

            <div className="progress-empty-icon">
              <Code2 size={22} />
            </div>

            <h3>No coding activity yet</h3>

            <p>
              Start solving coding problems to see
              your activity here.
            </p>

          </div>

        ) : (

          <div className="progress-list">

            {problems.map((problem, index) => {

              const status =
                problem.status || "Not Started";

              const statusClass =
                status
                  .toLowerCase()
                  .replace(/\s+/g, "-");


              return (
                <div
                  className="progress-list-item"
                  key={problem.id}
                >

                  <div className="activity-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>


                  <div className="activity-info">

                    <h3>
                      {problem.problem_title}
                    </h3>

                    <p>
                      {problem.attempts || 0}{" "}
                      {problem.attempts === 1
                        ? "attempt"
                        : "attempts"}
                    </p>

                  </div>


                  <span
                    className={`progress-status ${statusClass}`}
                  >
                    {status}
                  </span>

                </div>
              );

            })}

          </div>

        )}

      </section>

    </div>
  );
}
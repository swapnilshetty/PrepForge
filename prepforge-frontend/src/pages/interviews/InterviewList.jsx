import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { getQuestions } from "../../services/interviewService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import Badge from "../../components/Badge";
import {
  difficultyLabel,
  interviewTypeLabel,
} from "../../utils/formatters";
import "./Interviews.css";

const TYPES = [
  "all",
  "technical",
  "behavioral",
  "system_design",
];

const DIFFICULTIES = [
  "all",
  "easy",
  "medium",
  "hard",
];

export default function InterviewList() {
  const [type, setType] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const filters = useMemo(
    () => ({
      type,
      difficulty,
    }),
    [type, difficulty]
  );

  const {
    data,
    loading,
    error,
    reload,
  } = useApi(
    () => getQuestions(filters),
    [filters]
  );

  const questions = Array.isArray(data)
    ? data
    : data?.results || [];

  return (
    <div className="page interview-page">

      {/* Header */}

      <div className="page-head interview-page-head">
        <div>
          <h1>Interview questions</h1>

          <p>
            Technical, behavioral, and system design
            questions in one place.
          </p>
        </div>

        {!loading && !error && (
          <div className="question-count">
            {questions.length}{" "}
            {questions.length === 1
              ? "question"
              : "questions"}
          </div>
        )}
      </div>

      {/* Filters */}

      <div className="interview-filters">

        <div className="field">
          <label htmlFor="type">
            Type
          </label>

          <select
            id="type"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            {TYPES.map((t) => (
              <option
                key={t}
                value={t}
              >
                {t === "all"
                  ? "All types"
                  : interviewTypeLabel(t)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="difficulty">
            Difficulty
          </label>

          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
          >
            {DIFFICULTIES.map((d) => (
              <option
                key={d}
                value={d}
              >
                {d === "all"
                  ? "All difficulties"
                  : difficultyLabel(d)}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Loading */}

      {loading && (
        <LoadingState />
      )}

      {/* Error */}

      {error && (
        <ErrorState
          onRetry={reload}
        />
      )}

      {/* Empty */}

      {!loading &&
        !error &&
        questions.length === 0 && (
          <EmptyState
            message="No questions found."
          />
        )}

      {/* Questions */}

      {!loading &&
        !error &&
        questions.length > 0 && (

          <div className="question-list">

            {questions.map((q, index) => (

              <Link
                key={q.id}
                to={`/interviews/${q.id}`}
                className="card question-row"
              >

                <div className="question-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="question-row-content">

                  <div className="question-row-title">
                    {q.title}
                  </div>

                  <div className="question-row-tags">

                    <Badge variant="neutral">
                      {interviewTypeLabel(
                        q.question_type
                      )}
                    </Badge>

                    <Badge
                      variant={
                        (q.difficulty || "")
                          .toLowerCase()
                      }
                    >
                      {difficultyLabel(
                        q.difficulty
                      )}
                    </Badge>

                  </div>

                </div>

                <div className="question-arrow">
                  →
                </div>

              </Link>

            ))}

          </div>

        )}

    </div>
  );
}
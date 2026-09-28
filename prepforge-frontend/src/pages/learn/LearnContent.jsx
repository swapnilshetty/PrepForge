import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import {
  getContentById,
  getLessonProgress,
  completeLesson,
} from "../../services/learningService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import "./Learn.css";

export default function LearnContent() {
  const { id } = useParams();

  const {
    data: lesson,
    loading,
    error,
    reload,
  } = useApi(() => getContentById(id), [id]);

  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProgress() {
      try {
        const progress = await getLessonProgress();

        const currentLesson = progress.find(
          (item) => String(item.content) === String(id)
        );

        if (currentLesson?.completed) {
          setCompleted(true);
        }
      } catch (error) {
        console.error("Failed to load lesson progress:", error);
      }
    }

    if (id) {
      loadProgress();
    }
  }, [id]);

  async function handleComplete() {
    if (completed || saving) {
      return;
    }

    try {
      setSaving(true);

      await completeLesson(Number(id));

      setCompleted(true);
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <ErrorState onRetry={reload} />
      </div>
    );
  }

  const paragraphs = (lesson?.content || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/learn">Learn</Link>
        <span className="sep">/</span>
        <span>{lesson?.title || "Lesson"}</span>
      </div>

      <article className="lesson-body">
        <h1>{lesson?.title || "Lesson"}</h1>

        {paragraphs.length ? (
          paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : (
          <p className="text-muted">No content available.</p>
        )}

        <div className="lesson-completion">
          <button
            type="button"
            className={`lesson-complete-button ${
              completed ? "completed" : ""
            }`}
            onClick={handleComplete}
            disabled={completed || saving}
          >
            {completed
              ? "✓ Lesson Completed"
              : saving
                ? "Saving..."
                : "Mark as Complete"}
          </button>
        </div>
      </article>
    </div>
  );
}
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { getTopic } from "../../services/learningService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import "./Learn.css";

export default function LearnLesson() {
  const { topicSlug } = useParams();
  const { data: topic, loading, error, reload } = useApi(
    () => getTopic(topicSlug),
    [topicSlug]
  );

  const contents = topic?.contents || [];

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/learn">Learn</Link>
        <span className="sep">/</span>
        <span>{topic?.name || topicSlug}</span>
      </div>

      <div className="page-head">
        <h1>{topic?.name || "Topic"}</h1>
        {topic?.description && <p>{topic.description}</p>}
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && contents.length === 0 && (
        <EmptyState message="No lessons are available for this topic yet." />
      )}

      {!loading && !error && contents.length > 0 && (
        <div className="topic-list">
          {contents.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/learn/content/${lesson.id}`}
              className="card topic-row"
            >
              <div>
                <h3>{lesson.title}</h3>
                <span className="text-muted">Lesson {lesson.order}</span>
              </div>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

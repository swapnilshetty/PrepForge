import { Link, useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { getCategory } from "../../services/learningService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import "./Learn.css";

export default function LearnTopics() {
  const { categorySlug } = useParams();
  const { data, loading, error, reload } = useApi(
    () => getCategory(categorySlug),
    [categorySlug]
  );

  const topics = data?.topics || [];

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/learn">Learn</Link>
        <span className="sep">/</span>
        <span>{data?.name || categorySlug}</span>
      </div>

      <div className="page-head">
        <h1>{data?.name || "Topics"}</h1>
        {data?.description && <p>{data.description}</p>}
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState onRetry={reload} />}
      {!loading && !error && topics.length === 0 && (
        <EmptyState message="No topics in this category yet." />
      )}

      {!loading && !error && topics.length > 0 && (
        <div className="topic-list">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/learn/topic/${topic.slug}`}
              className="card topic-row"
            >
              <div>
                <h3>{topic.name}</h3>
                {topic.description && <p>{topic.description}</p>}
                <span className="text-muted">{topic.contents?.length ?? 0} lessons</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

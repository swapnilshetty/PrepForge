import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { getCategories } from "../../services/learningService";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import "./Learn.css";

export default function LearnCategories() {
  const {
    data,
    loading,
    error,
    reload,
  } = useApi(() => getCategories(), []);

  const categories = Array.isArray(data) ? data : [];

  return (
    <div className="page learn-page">

      {/* Header */}

      <div className="page-head learn-page-head">
        <div>
          <h1>Learn</h1>

          <p>
            Work through structured material before
            you jump into problems.
          </p>
        </div>

        {!loading && !error && categories.length > 0 && (
          <div className="learn-count">
            {categories.length} categories
          </div>
        )}
      </div>

      {/* Loading */}

      {loading && (
        <LoadingState />
      )}

      {/* Error */}

      {error && (
        <ErrorState onRetry={reload} />
      )}

      {/* Empty */}

      {!loading &&
        !error &&
        categories.length === 0 && (
          <EmptyState
            message="No categories found."
          />
        )}

      {/* Categories */}

      {!loading &&
        !error &&
        categories.length > 0 && (

          <div className="category-grid">

            {categories.map((category, index) => (

              <Link
                key={category.slug}
                to={`/learn/${category.slug}`}
                className="card category-card"
              >

                <div className="category-card-top">

                  <div className="category-icon">
                    <BookOpen size={20} />
                  </div>

                  <span className="category-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>

                <div className="category-card-content">

                  <h3>
                    {category.name}
                  </h3>

                  <p>
                    {category.description}
                  </p>

                </div>

                <div className="category-card-bottom">

                  <span className="category-card-count">
                    {category.topics_count ?? 0}{" "}
                    {category.topics_count === 1
                      ? "topic"
                      : "topics"}
                  </span>

                  <span className="category-arrow">
                    <ArrowRight size={18} />
                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Search,
  ArrowRight,
} from "lucide-react";

import { useApi } from "../../hooks/useApi";
import { getProblems } from "../../services/codingService";
import { getTopics } from "../../services/learningService";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import Badge from "../../components/Badge";

import { difficultyLabel } from "../../utils/formatters";

import "./Coding.css";

const DIFFICULTIES = [
  "all",
  "easy",
  "medium",
  "hard",
];

const STATUS_LABELS = {
  solved: "Solved",
  attempted: "Attempted",
  unattempted: "Not started",
};

function normalizeStatus(status) {
  if (!status) {
    return "unattempted";
  }

  const value = status.toLowerCase();

  if (value === "solved") {
    return "solved";
  }

  if (value === "attempted") {
    return "attempted";
  }

  return "unattempted";
}

export default function CodingList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState("all");

  const [allTopics, setAllTopics] = useState([]);

  /* ---------------------------------------------------------
     Search debounce
     --------------------------------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------------------------------------------------
     Load topics
     --------------------------------------------------------- */

  useEffect(() => {
    getTopics()
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : res?.results || [];

        setAllTopics(
          list.map((item) => ({
            name: item.name,
            slug: item.slug,
          }))
        );
      })
      .catch(() => {
        setAllTopics([]);
      });
  }, []);

  /* ---------------------------------------------------------
     API filters
     --------------------------------------------------------- */

  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      difficulty,
      topic,
    }),
    [
      debouncedSearch,
      difficulty,
      topic,
    ]
  );

  const {
    data,
    loading,
    error,
    reload,
  } = useApi(
    () => getProblems(filters),
    [filters]
  );

  const rawProblems = Array.isArray(data)
    ? data
    : data?.results || [];

  /* ---------------------------------------------------------
     Topic filtering
     --------------------------------------------------------- */

  const selectedTopic = allTopics.find(
    (item) => item.slug === topic
  );

  const problems = rawProblems.filter((problem) => {
    const matchesSearch =
      !debouncedSearch ||
      problem.title
        ?.toLowerCase()
        .includes(
          debouncedSearch.toLowerCase()
        );

    const matchesTopic =
      topic === "all" ||
      problem.topic_name ===
        selectedTopic?.name;

    return (
      matchesSearch &&
      matchesTopic
    );
  });

  return (
    <div className="page coding-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-head coding-page-head">

        <div>
          <h1>Coding practice</h1>

          <p>
            Build problem-solving skills through
            focused practice.
          </p>
        </div>

        {!loading && !error && (
          <div className="coding-count">
            {problems.length}{" "}
            {problems.length === 1
              ? "problem"
              : "problems"}
          </div>
        )}

      </div>


      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="coding-filters">

        {/* Search */}

        <div className="field field--search">

          <label htmlFor="search">
            Search problems
          </label>

          <div className="coding-search">

            <Search
              size={17}
              className="coding-search-icon"
            />

            <input
              id="search"
              type="search"
              placeholder="Search by problem name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {/* Difficulty */}

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
            {DIFFICULTIES.map((value) => (
              <option
                key={value}
                value={value}
              >
                {value === "all"
                  ? "All difficulties"
                  : difficultyLabel(value)}
              </option>
            ))}
          </select>

        </div>


        {/* Topic */}

        <div className="field">

          <label htmlFor="topic">
            Topic
          </label>

          <select
            id="topic"
            value={topic}
            onChange={(e) =>
              setTopic(e.target.value)
            }
          >

            <option value="all">
              All topics
            </option>

            {allTopics.map((item) => (
              <option
                key={item.slug}
                value={item.slug}
              >
                {item.name}
              </option>
            ))}

          </select>

        </div>

      </div>


      {/* =====================================================
          STATES
          ===================================================== */}

      {loading && (
        <LoadingState />
      )}

      {error && (
        <ErrorState
          onRetry={reload}
        />
      )}

      {!loading &&
        !error &&
        problems.length === 0 && (
          <EmptyState
            message="No coding problems found."
          />
        )}


      {/* =====================================================
          PROBLEM GRID
          ===================================================== */}

      {!loading &&
        !error &&
        problems.length > 0 && (

          <div className="problem-grid">

            {problems.map((problem, index) => {

              const status =
                normalizeStatus(
                  problem.status
                );

              return (
                <Link
                  key={problem.slug}
                  to={`/coding/${problem.slug}`}
                  className="card problem-card"
                >

                  {/* Card top */}

                  <div className="problem-card-top">

                    <div className="problem-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="problem-icon">
                      <Code2 size={17} />
                    </div>

                  </div>


                  {/* Content */}

                  <div className="problem-card-content">

                    <h3>
                      {problem.title}
                    </h3>

                    <p>
                      {problem.topic_name ||
                        "Coding problem"}
                    </p>

                  </div>


                  {/* Metadata */}

                  <div className="problem-card-meta">

                    <Badge
                      variant={
                        (
                          problem.difficulty ||
                          ""
                        ).toLowerCase()
                      }
                    >
                      {difficultyLabel(
                        problem.difficulty
                      )}
                    </Badge>

                    <Badge variant="neutral">
                      {problem.topic_name ||
                        "General"}
                    </Badge>

                  </div>


                  {/* Bottom */}

                  <div className="problem-card-bottom">

                    <span
                      className={`problem-status problem-status--${status}`}
                    >
                      {STATUS_LABELS[status]}
                    </span>

                    <span className="problem-arrow">
                      <ArrowRight size={18} />
                    </span>

                  </div>

                </Link>
              );
            })}

          </div>

        )}

    </div>
  );
}
import { useEffect, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { useApi } from "../../hooks/useApi";

import {
  getQuestion,
  getBookmarks,
  createBookmark,
  deleteBookmark,
  getAnswers,
  createAnswer,
  getInterviewProgress,
  updateInterviewProgress,
} from "../../services/interviewService";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import Badge from "../../components/Badge";

import {
  difficultyLabel,
  interviewTypeLabel,
} from "../../utils/formatters";

import "./Interviews.css";


export default function InterviewDetail() {
  const { id } = useParams();

  const {
    data: question,
    loading,
    error,
    reload,
  } = useApi(
    () => getQuestion(id),
    [id]
  );


  const [bookmarkId, setBookmarkId] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  const [prepared, setPrepared] = useState(false);

  const [answer, setAnswer] = useState("");

  const [
    savingAnswer,
    setSavingAnswer,
  ] = useState(false);

  const [
    answerMessage,
    setAnswerMessage,
  ] = useState("");

  const [
    savingBookmark,
    setSavingBookmark,
  ] = useState(false);

  const [
    savingPrepared,
    setSavingPrepared,
  ] = useState(false);


  /*
   * Load user's bookmark, answer and
   * preparation status.
   */

  useEffect(() => {
    async function loadUserData() {
      try {
        const [
          bookmarks,
          answers,
          progress,
        ] = await Promise.all([
          getBookmarks(),
          getAnswers(),
          getInterviewProgress(),
        ]);


        const questionId = Number(id);


        // Find bookmark

        const existingBookmark =
          bookmarks.find(
            (item) =>
              Number(item.interview_question) ===
              questionId
          );

        if (existingBookmark) {
          setBookmarked(true);
          setBookmarkId(existingBookmark.id);
        } else {
          setBookmarked(false);
          setBookmarkId(null);
        }


        // Find saved answer

        const existingAnswer =
          answers.find(
            (item) =>
              Number(item.question) ===
              questionId
          );

        if (existingAnswer) {
          setAnswer(
            existingAnswer.answer || ""
          );
        } else {
          setAnswer("");
        }


        // Find preparation status

        const existingProgress =
          progress.find(
            (item) =>
              Number(item.question) ===
              questionId
          );

        if (existingProgress) {
          setPrepared(
            Boolean(existingProgress.prepared)
          );
        } else {
          setPrepared(false);
        }

      } catch (error) {
        console.error(
          "Failed to load interview user data:",
          error
        );
      }
    }


    if (id) {
      loadUserData();
    }

  }, [id]);


  /*
   * Toggle bookmark.
   */

  async function handleBookmark() {
    if (savingBookmark) {
      return;
    }


    try {
      setSavingBookmark(true);


      if (bookmarked && bookmarkId) {

        await deleteBookmark(bookmarkId);

        setBookmarked(false);
        setBookmarkId(null);

      } else {

        const result =
          await createBookmark({
            interview_question:
              Number(id),
          });

        setBookmarked(true);
        setBookmarkId(result.id);
      }

    } catch (error) {

      console.error(
        "Failed to update bookmark:",
        error
      );

    } finally {
      setSavingBookmark(false);
    }
  }


  /*
   * Save user's own interview answer.
   */

  async function handleSaveAnswer() {

    if (!answer.trim()) {
      setAnswerMessage(
        "Please write an answer first."
      );
      return;
    }


    try {

      setSavingAnswer(true);
      setAnswerMessage("");


      await createAnswer({
        question: Number(id),
        answer: answer.trim(),
      });


      setAnswerMessage(
        "Answer saved successfully."
      );

    } catch (error) {

      console.error(
        "Failed to save interview answer:",
        error
      );

      setAnswerMessage(
        "Unable to save your answer. Please try again."
      );

    } finally {

      setSavingAnswer(false);

    }
  }


  /*
   * Toggle prepared status.
   */

  async function handlePrepared() {

    if (savingPrepared) {
      return;
    }


    const newValue = !prepared;


    try {

      setSavingPrepared(true);


      await updateInterviewProgress(
        Number(id),
        newValue
      );


      setPrepared(newValue);

    } catch (error) {

      console.error(
        "Failed to update preparation status:",
        error
      );

    } finally {

      setSavingPrepared(false);

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


  return (
    <div className="page">

      {/* Breadcrumb */}

      <div className="breadcrumb">

        <Link to="/interviews">
          Interviews
        </Link>

        <span className="sep">
          /
        </span>

        <span>
          Question
        </span>

      </div>


      <div className="card question-detail-card">

        {/* Title */}

        <h1>
          {question?.title}
        </h1>


        {/* Metadata */}

        <div className="question-detail-meta">

          <Badge variant="neutral">
            {interviewTypeLabel(
              question?.question_type
            )}
          </Badge>


          <Badge
            variant={
              (
                question?.difficulty || ""
              ).toLowerCase()
            }
          >
            {difficultyLabel(
              question?.difficulty
            )}
          </Badge>


          {question?.topic_name && (
            <Badge variant="neutral">
              {question.topic_name}
            </Badge>
          )}

        </div>


        {/* Question */}

        <h3>
          Question
        </h3>

        <p>
          {question?.title ||
            "No question content available."}
        </p>


        {/* Reference answer */}

        <h3>
          Reference Answer
        </h3>

        <p>
          {question?.answer ||
            "No reference answer provided."}
        </p>


        {/* User answer */}

        <h3>
          Your Answer
        </h3>


        <textarea
          className="interview-answer-input"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setAnswerMessage("");
          }}
          placeholder="Write your own answer here..."
          rows={8}
        />


        <div className="interview-answer-actions">

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAnswer}
            disabled={savingAnswer}
          >
            {savingAnswer
              ? "Saving..."
              : "Save Answer"}
          </button>


          {answerMessage && (
            <span className="editor-note">
              {answerMessage}
            </span>
          )}

        </div>


        {/* Actions */}

        <div className="question-actions">

          <button
            type="button"
            className={`btn ${
              bookmarked
                ? "btn-toggled"
                : "btn-secondary"
            }`}
            onClick={handleBookmark}
            disabled={savingBookmark}
          >

            <Bookmark size={16} />

            {savingBookmark
              ? "Saving..."
              : bookmarked
                ? "Bookmarked"
                : "Bookmark"}

          </button>


          <button
            type="button"
            className={`btn ${
              prepared
                ? "btn-toggled"
                : "btn-secondary"
            }`}
            onClick={handlePrepared}
            disabled={savingPrepared}
          >

            <CheckCircle2 size={16} />

            {savingPrepared
              ? "Saving..."
              : prepared
                ? "Prepared"
                : "Mark as Prepared"}

          </button>

        </div>

      </div>

    </div>
  );
}
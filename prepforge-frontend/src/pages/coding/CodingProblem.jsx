import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Play,
  Send,
  Info,
} from "lucide-react";

import { useApi } from "../../hooks/useApi";
import {
  getProblem,
  createSubmission,
  runCode,
} from "../../services/codingService";

import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

import "./Coding.css";


/* =========================================================
   LANGUAGE-SPECIFIC STARTER CODE
   ========================================================= */

function getStarterCode(problem, language) {
  if (!problem) return "";

  const slug = problem.slug?.toLowerCase() || "";
  const title = problem.title?.toLowerCase() || "";

  /* ---------------- PYTHON ---------------- */

  if (language === "python") {
    return problem.starter_code || `def solution():
    pass`;
  }


  /* ---------------- JAVA ---------------- */

  if (language === "java") {

    if (slug.includes("two-sum") || title.includes("two sum")) {
      return `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`;
    }

    if (slug.includes("reverse-string") || title.includes("reverse string")) {
      return `class Solution {
    public void reverseString(char[] s) {
        
    }
}`;
    }

    if (
      slug.includes("valid-parentheses") ||
      title.includes("valid parentheses")
    ) {
      return `class Solution {
    public boolean isValid(String s) {
        
    }
}`;
    }

    if (slug.includes("binary-search") || title.includes("binary search")) {
      return `class Solution {
    public int search(int[] nums, int target) {
        
    }
}`;
    }

    if (
      slug.includes("maximum-subarray") ||
      title.includes("maximum subarray")
    ) {
      return `class Solution {
    public int maxSubArray(int[] nums) {
        
    }
}`;
    }

    if (
      slug.includes("climbing-stairs") ||
      slug.includes("climb-stairs") ||
      title.includes("climbing stairs") ||
      title.includes("climb stairs")
    ) {
      return `class Solution {
    public int climbStairs(int n) {
        
    }
}`;
    }

    return `class Solution {
    public void solution() {
        
    }
}`;
  }


  /* ---------------- JAVASCRIPT ---------------- */

  if (language === "javascript") {

    if (slug.includes("two-sum") || title.includes("two sum")) {
      return `function twoSum(nums, target) {
    
}`;
    }

    if (slug.includes("reverse-string") || title.includes("reverse string")) {
      return `function reverseString(s) {
    
}`;
    }

    if (
      slug.includes("valid-parentheses") ||
      title.includes("valid parentheses")
    ) {
      return `function isValid(s) {
    
}`;
    }

    if (slug.includes("binary-search") || title.includes("binary search")) {
      return `function search(nums, target) {
    
}`;
    }

    if (
      slug.includes("maximum-subarray") ||
      title.includes("maximum subarray")
    ) {
      return `function maxSubArray(nums) {
    
}`;
    }

    if (
      slug.includes("climbing-stairs") ||
      slug.includes("climb-stairs") ||
      title.includes("climbing stairs") ||
      title.includes("climb stairs")
    ) {
      return `function climbStairs(n) {
    
}`;
    }

    return `function solution() {
    
}`;
  }

  return "";
}


export default function CodingProblem() {
  const { slug } = useParams();

  const {
    data: problem,
    loading,
    error,
    reload,
  } = useApi(() => getProblem(slug), [slug]);


  const [language, setLanguage] = useState("python");

  const [code, setCode] = useState("");

  const [runNote, setRunNote] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [input, setInput] = useState("");
  const [executionResult, setExecutionResult] = useState(null);
  const [running, setRunning] = useState(false);


  /* =========================================================
     LOAD LANGUAGE-SPECIFIC STARTER CODE
     ========================================================= */

  useEffect(() => {
    if (!problem) return;

    setCode(getStarterCode(problem, language));

    setRunNote(null);
  }, [problem, language]);


  /* =========================================================
     RUN
     ========================================================= */

     async function handleRun() {
      if (!code.trim()) {
        setRunNote("Please write some code before running.");
        return;
      }
    
      try {
        setRunning(true);
        setRunNote(null);
        setExecutionResult(null);
    
        const result = await runCode({
          source_code: code,
          language: language,
          stdin: input,
        });
    
        setExecutionResult(result);
    
      } catch (error) {
        console.error("Code execution failed:", error);
    
        setRunNote(
          error?.response?.data?.detail ||
          "Unable to execute code."
        );
    
      } finally {
        setRunning(false);
      }
    }


  /* =========================================================
     SUBMIT
     ========================================================= */

  async function handleSubmit() {
    if (!problem) return;

    if (!code.trim()) {
      setRunNote("Please write some code before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setRunNote(null);

      await createSubmission({
        problem: problem.id,
        language,
        source_code: code,
      });

      setRunNote("Submission saved successfully.");

    } catch (err) {
      console.error(err);

      setRunNote(
        err?.response?.data?.detail ||
        "Unable to submit your code."
      );

    } finally {
      setSubmitting(false);
    }
  }


  /* =========================================================
     LOADING / ERROR
     ========================================================= */

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
        <ErrorState
          message="Unable to load this coding problem."
          onRetry={reload}
        />
      </div>
    );
  }


  if (!problem) {
    return (
      <div className="page">
        <div className="card empty-state">
          <p>Problem not found.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-head">

        <div className="breadcrumb">
          <Link to="/coding">
            <ArrowLeft size={16} />
            Coding
          </Link>

          <span>/</span>

          <span>{problem.title}</span>
        </div>


        <div className="problem-detail-header">

          <div className="problem-detail-title-row">

            <div className="problem-detail-icon">
              <Code2 size={24} />
            </div>

            <div>
              <h1>{problem.title}</h1>

              <div className="problem-tags">

                <span
                  className={`badge difficulty-${problem.difficulty?.toLowerCase()}`}
                >
                  {problem.difficulty}
                </span>

                {problem.topic_name && (
                  <span className="badge badge-outline">
                    {problem.topic_name}
                  </span>
                )}

              </div>
            </div>

          </div>


          <Link
            to="/coding"
            className="btn btn-secondary problem-back-button"
          >
            <ArrowLeft size={16} />
            Back to problems
          </Link>

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <div className="problem-detail">


        {/* ===================================================
            PROBLEM DESCRIPTION
            =================================================== */}

        <div className="card problem-spec">

          <section className="problem-section">

            <h2>Problem</h2>

            <p>
              {problem.description}
            </p>

          </section>


          {problem.input_format && (
            <section className="problem-section">

              <h3>Input</h3>

              <p>
                {problem.input_format}
              </p>

            </section>
          )}


          {problem.output_format && (
            <section className="problem-section">

              <h3>Output</h3>

              <p>
                {problem.output_format}
              </p>

            </section>
          )}


          {problem.constraints && (
            <section className="problem-section">

              <h3>Constraints</h3>

              <pre>
                {problem.constraints}
              </pre>

            </section>
          )}

        </div>


        {/* ===================================================
            CODE EDITOR
            =================================================== */}

        <div className="editor-panel">

          <div className="card editor-card">


            {/* TOOLBAR */}

            <div className="editor-toolbar">

              <div className="editor-language">

                <Code2 size={18} />

                <div className="field">

                  <label htmlFor="language">
                    Language
                  </label>

                  <select
                    id="language"
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value)
                    }
                  >

                    <option value="python">
                      Python
                    </option>

                    <option value="java">
                      Java
                    </option>

                    <option value="javascript">
                      JavaScript
                    </option>

                  </select>

                </div>

              </div>

            </div>
            {executionResult && (
  <div className="execution-result">

    <div className="execution-result-header">
      <h3>Output</h3>

      <span
        className={
          executionResult.status === "Accepted"
            ? "execution-status accepted"
            : "execution-status failed"
        }
      >
        {executionResult.status}
      </span>
    </div>


    {executionResult.stdout && (
      <pre className="execution-output">
        {executionResult.stdout}
      </pre>
    )}


    {executionResult.stderr && (
      <pre className="execution-error">
        {executionResult.stderr}
      </pre>
    )}


    {executionResult.compile_output && (
      <pre className="execution-error">
        {executionResult.compile_output}
      </pre>
    )}


    {executionResult.time && (
      <div className="execution-meta">
        Runtime: {executionResult.time}s
      </div>
    )}

  </div>
)}

            {/* CODE */}

            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder="Write your code here..."
            />

<div className="editor-input">

<label htmlFor="program-input">
  Custom Input
</label>

<textarea
  id="program-input"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Enter input for your program..."
  spellCheck={false}
/>

</div>
            {/* ACTIONS */}

            <div className="editor-actions">

            <button
  type="button"
  className="btn btn-secondary"
  onClick={handleRun}
  disabled={running}
>
  <Play size={16} />

  {running ? "Running..." : "Run Code"}
</button>


              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >

                {submitting ? (
                  <>
                    <CheckCircle2 size={16} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit
                  </>
                )}

              </button>

            </div>


            {/* MESSAGE */}

            {runNote && (
              <p className="editor-note">

                <Info size={16} />

                <span>{runNote}</span>

              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
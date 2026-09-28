import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/password-reset/",
        {
          email,
        }
      );

      setMessage(
        response.data.detail ||
          "If an account exists with that email, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to process the request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* Branding */}

      <section className="login-brand">

        <div className="login-logo">
          <div className="login-logo-mark">
            P
          </div>

          PrepForge
        </div>

        <div className="login-brand-content">

          <h1>
            Build skills.
            <br />
            <span>Forge confidence.</span>
          </h1>

          <p>
            Your all-in-one interview preparation platform for
            learning, coding practice, and interview preparation.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span className="login-feature-icon">
                ✓
              </span>
              Structured learning paths
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">
                ✓
              </span>
              Real coding practice
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">
                ✓
              </span>
              Technical & behavioral interview preparation
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">
                ✓
              </span>
              Track your progress and improve
            </div>

          </div>

        </div>

        <div className="login-brand-footer">
          © 2026 PrepForge
        </div>

      </section>


      {/* Forgot password form */}

      <section className="login-form-section">

        <div className="login-card">

          <div className="login-card-header">

            <h2>
              Forgot your password?
            </h2>

            <p>
              Enter your email address and we'll send you
              a link to reset your password.
            </p>

          </div>


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-field">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
              />

            </div>


            {message && (
              <p
                className="login-success"
                role="status"
              >
                {message}
              </p>
            )}


            {error && (
              <p
                className="login-error"
                role="alert"
              >
                {error}
              </p>
            )}


            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send reset link"}
            </button>

          </form>


          <p className="login-register">

            Remember your password?{" "}

            <Link to="/login">
              Back to login
            </Link>

          </p>

        </div>

      </section>

    </div>
  );
}
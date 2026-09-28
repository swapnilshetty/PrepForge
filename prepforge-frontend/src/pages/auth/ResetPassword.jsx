import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

export default function ResetPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/api/auth/password-reset-confirm/${uidb64}/${token}/`,
        {
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        }
      );

      setMessage(
        response.data.detail ||
          "Password reset successful. You can now log in."
      );

      setFormData({
        new_password: "",
        confirm_password: "",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response?.data?.new_password) {
        setError(error.response.data.new_password[0]);
      } else if (error.response?.data?.confirm_password) {
        setError(error.response.data.confirm_password[0]);
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Unable to reset your password. The link may be invalid or expired."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* Left branding section */}
      <section className="login-brand">

        <div className="login-logo">
          <div className="login-logo-mark">P</div>
          PrepForge
        </div>

        <div className="login-brand-content">

          <h1>
            Build skills.
            <br />
            <span>Forge confidence.</span>
          </h1>

          <p>
            Your all-in-one interview preparation platform for learning,
            coding practice, and interview preparation.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              Structured learning paths
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              Real coding practice
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              Technical & behavioral interview preparation
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              Track your progress and improve
            </div>

          </div>

        </div>

        <div className="login-brand-footer">
          © 2026 PrepForge
        </div>

      </section>


      {/* Right reset-password section */}
      <section className="login-form-section">

        <div className="login-card">

          <div className="login-card-header">

            <h2>Reset your password</h2>

            <p>
              Enter a new password for your PrepForge account.
            </p>

          </div>


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* New password */}
            <div className="login-field">

              <label htmlFor="new_password">
                New password
              </label>

              <input
                id="new_password"
                type="password"
                name="new_password"
                placeholder="Enter your new password"
                value={formData.new_password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />

            </div>


            {/* Confirm password */}
            <div className="login-field">

              <label htmlFor="confirm_password">
                Confirm password
              </label>

              <input
                id="confirm_password"
                type="password"
                name="confirm_password"
                placeholder="Confirm your new password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />

            </div>


            {/* Error */}
            {error && (
              <p
                className="login-error"
                role="alert"
              >
                {error}
              </p>
            )}


            {/* Success */}
            {message && (
              <p
                className="login-success"
                role="status"
              >
                {message}
              </p>
            )}


            {/* Submit */}
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Resetting password..."
                : "Reset password"}
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
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../services/api";
import "./Login.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      const data = error.response?.data;

      if (data?.username) {
        setError(data.username[0]);
      } else if (data?.email) {
        setError(data.email[0]);
      } else if (data?.password) {
        setError(data.password[0]);
      } else {
        setError("Registration failed. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <section className="login-brand">
        <div className="login-logo">
          <div className="login-logo-mark">P</div>
          PrepForge
        </div>

        <div className="login-brand-content">
          <h1>
            Start your
            <br />
            <span>prep journey.</span>
          </h1>

          <p>
            Learn, practice, and prepare for your next interview
            with everything you need in one place.
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
              Technical & behavioral preparation
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              Track your progress
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          © 2026 PrepForge
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-card">

          <div className="login-card-header">
            <h2>Create your account</h2>
            <p>Start preparing smarter with PrepForge.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="login-field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="login-register">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>
      </section>

    </div>
  );
}
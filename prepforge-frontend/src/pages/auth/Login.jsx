import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/login/",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {
      /*
       * HTTP 429:
       * django-axes has detected too many failed
       * login attempts.
       */
      if (error.response?.status === 429) {
        setError(
          "Too many failed login attempts. Please try again later."
        );
      }

      /*
       * Normal authentication failure.
       */
      else if (
        error.response?.data?.non_field_errors
      ) {
        setError(
          error.response.data.non_field_errors[0]
        );
      }

      /*
       * Generic fallback.
       *
       * We intentionally don't reveal whether
       * the username exists.
       */
      else {
        setError(
          "Login failed. Please check your username and password."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* ================================
          BRANDING SECTION
      ================================= */}

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


      {/* ================================
          LOGIN FORM SECTION
      ================================= */}

      <section className="login-form-section">

        <div className="login-card">


          {/* Header */}

          <div className="login-card-header">

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue your preparation.
            </p>

          </div>


          {/* Login form */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >


            {/* Username */}

            <div className="login-field">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />

            </div>


            {/* Password */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>


              <div className="password-input-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                </button>

              </div>


              {/* Forgot password */}

              <Link
                to="/forgot-password"
                className="forgot-password-link"
              >
                Forgot password?
              </Link>

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


            {/* Login button */}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign in"}

            </button>

          </form>


          {/* Register */}

          <p className="login-register">

            Don't have an account?{" "}

            <Link to="/register">
              Create an account
            </Link>

          </p>

        </div>

      </section>

    </div>
  );
}
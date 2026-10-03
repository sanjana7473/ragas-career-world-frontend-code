import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  UserRound,
} from "lucide-react";
import "./EmployeeLogin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmployeeLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();
   const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/employee/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Login failed with status ${response.status}.`
        );
      }

      if (!data.token) {
        throw new Error(
          "Employee token was not returned by the server."
        );
      }

      if (!data.employee) {
        throw new Error(
          "Employee information was not returned by the server."
        );
      }

      /* =========================================
         SAVE EMPLOYEE SESSION
      ========================================= */

      localStorage.setItem(
        "ragasEmployeeToken",
        data.token
      );

      localStorage.setItem(
        "ragasEmployeeLoggedIn",
        "true"
      );

      localStorage.setItem(
        "ragasEmployee",
        JSON.stringify(data.employee)
      );

      localStorage.setItem(
        "ragasUserRole",
        "employee"
      );

      /* =========================================
         REDIRECT TO DASHBOARD
      ========================================= */

      navigate("/employee-dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Employee login error:",
        err
      );

      setError(
        err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="employee-login-page">

      <div className="employee-login-container">

        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <section className="employee-login-info">

          <div className="employee-login-brand">

           

            <div>
              <strong>RAGAS</strong>
              <span>CAREER WORLD</span>
            </div>

          </div>

          <div className="employee-login-info-content">

            <p className="employee-login-eyebrow">
              AGENT PORTAL
            </p>

            <h1>
              Welcome to your
              <span> Agent Workspace</span>
            </h1>

            <p>
              Access your assigned jobs, review
              applications, manage candidates and
              track recruitment activity from one
              secure workspace.
            </p>

          </div>

          <div className="employee-login-footer-note">

            <UserRound size={16} />

            <span>
              Agent access is provided by the
              administrator.
            </span>

          </div>

        </section>

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <section className="employee-login-card">

          <div className="employee-login-card-heading">

            <div className="employee-login-icon">
              <UserRound size={20} />
            </div>

            <p>AGENT LOGIN</p>

            <h2>
              Sign in to your account
            </h2>

            <span>
              Use the credentials provided by your
              administrator.
            </span>

          </div>

          {error && (
            <div className="employee-login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="employee-login-form-group">

              <label htmlFor="employee-email">
                Email Address
              </label>

              <div className="employee-login-input">

                <Mail size={17} />

                <input
                  id="employee-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="employee-login-form-group">

              <label htmlFor="employee-password">
                Password
              </label>

              <div className="employee-login-input">

                <Lock size={17} />

                <input
                  id="employee-password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="employee-login-button"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </form>

          <button
            type="button"
            className="employee-login-back"
            onClick={() => navigate("/")}
          >
            ← Back to website
          </button>

        </section>

      </div>

    </main>
  );
};

export default EmployeeLogin;
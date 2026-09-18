
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminRegistration.css";
import ragasLogo from "../assets/ragas-logo.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


function AdminRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        API_BASE_URL;

      const response = await fetch(
        `${API_URL}/api/auth/admin/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Admin registration failed. Please try again."
        );
        setLoading(false);
        return;
      }

      setLoading(false);

      localStorage.removeItem("ragasAdminLoggedIn");
      localStorage.removeItem("ragasAdminToken");
      localStorage.removeItem("ragasAdmin");

      navigate("/admin/login");
    } catch (error) {
      console.error("Admin registration error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="admin-register-page">

      {/* LEFT SIDE */}
      <div className="admin-register-left">

        <div className="admin-register-brand">
          <img
            src={ragasLogo}
            alt="RAGAS Career World"
            className="admin-register-logo"
          />

          
        </div>

        <div className="admin-register-left-content">

          <p className="admin-register-eyebrow">
            ADMINISTRATION PORTAL
          </p>

          <h1>
            Create your
            <span> administrator account.</span>
          </h1>

          <p className="admin-register-description">
            Create an administrator account to securely manage
            candidates, employers, jobs, resumes, applications,
            partners, and recruitment operations.
          </p>

          <div className="admin-register-features">

            <div>
              <span>✓</span>
              <p>Manage candidates and employers</p>
            </div>

            <div>
              <span>✓</span>
              <p>Control jobs, resumes and applications</p>
            </div>

            <div>
              <span>✓</span>
              <p>Monitor your recruitment platform</p>
            </div>

          </div>

        </div>

        <div className="admin-register-copyright">
          © 2026 RAGAS CAREER WORLD
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="admin-register-right">

        <div className="admin-register-card">

          <div className="admin-register-icon">
            ♙
          </div>

          <p className="admin-register-card-eyebrow">
            ADMIN REGISTRATION
          </p>

          <h2>
            Create admin account
          </h2>

          <p className="admin-register-card-description">
            Set up your administrator credentials to access
            the RAGAS Career World admin panel.
          </p>

          {error && (
            <div className="admin-register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* FULL NAME */}
            <div className="admin-register-field">
              <label>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}
            <div className="admin-register-field">
              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* PHONE */}
            <div className="admin-register-field">
              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="admin-register-field">
              <label>
                Password
              </label>

              <div className="admin-register-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="admin-register-field">
              <label>
                Confirm Password
              </label>

              <div className="admin-register-password">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <div className="admin-register-terms">
              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms & Conditions and
                Security Policy.
              </span>
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="admin-register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Admin Account"}

              {!loading && <span>→</span>}
            </button>

          </form>

          {/* ADMIN LOGIN */}
          <div className="admin-register-login">
            <span>
              Already have an admin account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/login")
              }
            >
              Admin Login
            </button>
          </div>

          {/* USER LOGIN */}
          <div className="admin-register-user">
            <span>
              Are you a job seeker?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/user-login")
              }
            >
              User Login
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminRegistration;


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  ShieldCheck,
  Calendar,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Save,
} from "lucide-react";
import "./EmployerDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmployerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("ragasAdminToken");

        const response = await fetch(
          `${API_BASE_URL}/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Employee not found.");
        }

        setEmployee(data.data || data.employee || data);
      } catch (err) {
        console.error("Employee details error:", err);
        setError(
          err.message || "Failed to load employee details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setSavingPassword(true);

      const token = localStorage.getItem("ragasAdminToken");

      const response = await fetch(
        `${API_BASE_URL}/api/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update password."
        );
      }

      setPasswordMessage(
        "Employee password updated successfully."
      );

      setNewPassword("");
      setShowPassword(false);
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordError(
        err.message || "Unable to update password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="employee-details-page">
        <div className="employee-details-loading">
          <RefreshCw
            className="loading-icon"
            size={28}
          />
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-details-page">
        <div className="employee-details-error">
          <h2>Employee Not Found</h2>
          <p>{error}</p>

          <button
            className="back-employees-btn"
            onClick={() =>
              navigate("/admin/employees")
            }
          >
            <ArrowLeft size={18} />
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="employee-details-page">
      {/* Header */}
      <div className="employee-details-header">
        <button
          className="back-btn"
          onClick={() =>
            navigate("/admin/employees")
          }
        >
          <ArrowLeft size={18} />
          Back to Employees
        </button>

        <div className="employee-header-content">
          <div className="employee-avatar-large">
            <User size={34} />
          </div>

          <div>
            <h1>{employee.name || "Employee"}</h1>

            <p>
              {employee.designation ||
                employee.department ||
                "Employee"}
            </p>
          </div>

          <span
            className={`employee-status ${
              employee.status?.toLowerCase() ===
              "active"
                ? "active"
                : "inactive"
            }`}
          >
            {employee.status || "Active"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="employee-details-grid">
        {/* Contact Information */}
        <div className="employee-details-card">
          <div className="card-title">
            <Mail size={20} />
            <h2>Contact Information</h2>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>Email</span>
              <strong>
                {employee.email || "N/A"}
              </strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Phone size={18} />
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {employee.phone || "N/A"}
              </strong>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="employee-details-card">
          <div className="card-title">
            <Briefcase size={20} />
            <h2>Professional Information</h2>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Building2 size={18} />
            </div>

            <div>
              <span>Department</span>
              <strong>
                {employee.department || "N/A"}
              </strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Briefcase size={18} />
            </div>

            <div>
              <span>Designation</span>
              <strong>
                {employee.designation || "N/A"}
              </strong>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="employee-details-card">
          <div className="card-title">
            <ShieldCheck size={20} />
            <h2>Account Information</h2>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>Role</span>
              <strong>
                {employee.role || "employee"}
              </strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>Status</span>
              <strong>
                {employee.status || "Active"}
              </strong>
            </div>
          </div>
        </div>

        {/* Account Dates */}
        <div className="employee-details-card">
          <div className="card-title">
            <Calendar size={20} />
            <h2>Account Dates</h2>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Calendar size={18} />
            </div>

            <div>
              <span>Created On</span>
              <strong>
                {formatDate(employee.createdAt)}
              </strong>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Calendar size={18} />
            </div>

            <div>
              <span>Last Updated</span>
              <strong>
                {formatDate(employee.updatedAt)}
              </strong>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="employee-details-card password-card">
          <div className="card-title">
            <Lock size={20} />
            <h2>Password</h2>
          </div>

          <p className="password-description">
            Set a new password for this employee account.
          </p>

          <form
            onSubmit={handlePasswordUpdate}
            className="password-form"
          >
            <label>New Password</label>

            <div className="password-input-wrapper">
              <Lock size={18} />

              <input
                type={
                  showPassword ? "text" : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                minLength={6}
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

            {passwordError && (
              <p className="password-error">
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p className="password-success">
                {passwordMessage}
              </p>
            )}

            <button
              type="submit"
              className="save-password-btn"
              disabled={savingPassword}
            >
              <Save size={17} />

              {savingPassword
                ? "Updating..."
                : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerDetails;
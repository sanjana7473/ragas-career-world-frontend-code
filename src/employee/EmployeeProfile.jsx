import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import "./EmployeeProfile.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmployeeProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    status: "Active",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem("ragasEmployeeToken");
  };

  /* =====================================================
     EMPLOYEE INITIAL
  ===================================================== */

  const getInitial = (name) => {
    if (!name) return "E";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  /* =====================================================
     FETCH PROFILE
  ===================================================== */

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token is missing. Please log in again."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employees/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load agent profile."
        );
      }

      const employee = data?.data || {};

      setProfile({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        designation: employee.designation || "",
        status: employee.status || "Active",
      });

      localStorage.setItem(
        "ragasEmployee",
        JSON.stringify(employee)
      );
    } catch (err) {
      console.error(
        "Fetch agent profile error:",
        err
      );

      setError(
        err.message ||
          "Unable to load agent profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =====================================================
     PROFILE CHANGE
  ===================================================== */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!profile.name.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSavingProfile(true);

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token is missing. Please log in again."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employees/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name.trim(),
            phone: profile.phone.trim(),
            department: profile.department.trim(),
            designation: profile.designation.trim(),
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update profile."
        );
      }

      const employee = data?.data || {};

      setProfile({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        designation: employee.designation || "",
        status: employee.status || "Active",
      });

      localStorage.setItem(
        "ragasEmployee",
        JSON.stringify(employee)
      );

      setMessage(
        data?.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.message ||
          "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /* =====================================================
     PASSWORD CHANGE
  ===================================================== */

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token is missing. Please log in again."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employees/me/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to change password."
        );
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        data?.message ||
          "Password changed successfully."
      );
    } catch (err) {
      console.error(
        "Change password error:",
        err
      );

      setError(
        err.message ||
          "Unable to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="employee-profile-page">
        <div className="employee-profile-main">
          <div className="employee-profile-loading">
            <Loader2 className="employee-profile-spinner" />
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="employee-profile-page">

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="employee-profile-main">

        {/* HEADER */}

        <div className="employee-profile-header">

          <div>
            <p className="employee-profile-eyebrow">
              AGENT ACCOUNT
            </p>

            <h1>My Profile</h1>

            <p>
              Manage your Agent information and
              account security.
            </p>
          </div>

          <div className="employee-profile-header-card">

            <div className="employee-profile-header-avatar">
              {getInitial(profile.name)}
            </div>

            <div>
              <strong>
                {profile.name || "Employee"}
              </strong>

              <span>
                {profile.email}
              </span>
            </div>

          </div>

        </div>

        {/* OVERVIEW */}

        <div className="employee-profile-overview">

          <div className="employee-profile-overview-avatar">
            {getInitial(profile.name)}
          </div>

          <div className="employee-profile-overview-text">

            <h2>
              {profile.name || "Employee"}
            </h2>

            <p>
              {profile.designation ||
                "Employee"}

              {profile.department
                ? ` • ${profile.department}`
                : ""}
            </p>

            <span>
              <ShieldCheck size={12} />
              {profile.status || "Active"}
            </span>

          </div>

        </div>

        {/* ALERTS */}

        {message && (
          <div className="employee-profile-alert success">
            <CheckCircle size={16} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="employee-profile-alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="employee-profile-card">

          <div className="employee-profile-card-heading">

            <div className="employee-profile-card-icon">
              <User size={19} />
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>
                Update your basic Agent information.
              </p>
            </div>

          </div>

          <form onSubmit={handleProfileSubmit}>

            <div className="employee-profile-form-grid">

              {/* FULL NAME */}

              <div className="employee-profile-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="employee-profile-input">
                  <User size={16} />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                  />
                </div>

              </div>

              {/* EMAIL */}

              <div className="employee-profile-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="employee-profile-input disabled">
                  <Mail size={16} />

                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    readOnly
                  />
                </div>

                <small>
                  Email address cannot be changed here.
                </small>

              </div>

              {/* PHONE */}

              <div className="employee-profile-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="employee-profile-input">
                  <Phone size={16} />

                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                  />
                </div>

              </div>

              {/* DEPARTMENT */}

              <div className="employee-profile-field">

                <label htmlFor="department">
                  Department
                </label>

                <div className="employee-profile-input">
                  <Building2 size={16} />

                  <input
                    id="department"
                    name="department"
                    type="text"
                    value={profile.department}
                    onChange={handleProfileChange}
                    placeholder="Enter department"
                  />
                </div>

              </div>

              {/* DESIGNATION */}

              <div className="employee-profile-field full">

                <label htmlFor="designation">
                  Designation
                </label>

                <div className="employee-profile-input">
                  <BriefcaseBusiness size={16} />

                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    value={profile.designation}
                    onChange={handleProfileChange}
                    placeholder="Enter designation"
                  />
                </div>

              </div>

            </div>

            <div className="employee-profile-form-actions">

              <button
                type="submit"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <>
                    <Loader2
                      size={15}
                      className="employee-profile-button-spinner"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

        {/* =================================================
            ACCOUNT SECURITY
        ================================================= */}

        <div className="employee-profile-card">

          <div className="employee-profile-card-heading">

            <div className="employee-profile-card-icon">
              <Lock size={19} />
            </div>

            <div>
              <h2>Account Security</h2>

              <p>
                Change your agent account password.
              </p>
            </div>

          </div>

          <form
            className="employee-password-form"
            onSubmit={handlePasswordSubmit}
          >

            <div className="employee-profile-password-grid">

              {/* CURRENT PASSWORD */}

              <div className="employee-profile-field">

                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <div className="employee-profile-password-input">

                  <Lock size={16} />

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label="Toggle current password"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* NEW PASSWORD */}

              <div className="employee-profile-field">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <div className="employee-profile-password-input">

                  <Lock size={16} />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label="Toggle new password"
                  >
                    {showNewPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

                <small>
                  Password must contain at least 6
                  characters.
                </small>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="employee-profile-field">

              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <div className="employee-profile-password-input">

                <Lock size={16} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label="Toggle confirm password"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>

            </div>

            <div className="employee-profile-form-actions">

              <button
                type="submit"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <Loader2
                      size={15}
                      className="employee-profile-button-spinner"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Change Password
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
};

export default EmployeeProfile;
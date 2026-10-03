import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  Mail,
  MapPin,
  Phone,
  XCircle,
  MessageSquare,
  FileText,
  Building2,
  RefreshCw,
} from "lucide-react";

import "./EmployeeApplicationDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusOrder = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

const statusTimeline = [
  {
    status: "Applied",
    label: "Application Submitted",
    description: "Candidate submitted the application.",
    icon: FileText,
  },
  {
    status: "Under Review",
    label: "Application Reviewed",
    description:
      "Application is being reviewed by the recruitment team.",
    icon: Clock3,
  },
  {
    status: "Shortlisted",
    label: "Candidate Shortlisted",
    description:
      "Candidate moved forward in the recruitment process.",
    icon: CheckCircle2,
  },
  {
    status: "Interview",
    label: "Interview",
    description:
      "Candidate progressed to the interview stage.",
    icon: MessageSquare,
  },
  {
    status: "Selected",
    label: "Selected / Hired",
    description:
      "Candidate was selected for the position.",
    icon: CheckCircle2,
  },
];

function getStatusClass(status = "") {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function getTimelineState(itemStatus, currentStatus) {
  if (currentStatus === "Rejected") {
    if (
      itemStatus === "Applied" ||
      itemStatus === "Under Review"
    ) {
      return "completed";
    }

    return "inactive";
  }

  const currentIndex = statusTimeline.findIndex(
    (item) => item.status === currentStatus
  );

  const itemIndex = statusTimeline.findIndex(
    (item) => item.status === itemStatus
  );

  if (currentIndex === -1 || itemIndex === -1) {
    return "inactive";
  }

  return itemIndex <= currentIndex
    ? "completed"
    : "inactive";
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EmployeeApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getToken = () => {
    return localStorage.getItem("ragasEmployeeToken");
  };

  // =========================================================
  // FETCH APPLICATION
  // =========================================================

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/employee-login", {
          replace: true,
        });
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employee/applications/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes(
        "application/json"
      )
        ? await response.json()
        : {
            success: false,
            message:
              "Server returned an invalid response.",
          };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load application details."
        );
      }

      setApplication(data.data);
    } catch (err) {
      console.error(
        "Employee application details error:",
        err
      );

      setError(
        err.message ||
          "Unable to load application details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) {
        navigate("/employee-login", {
          replace: true,
        });
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employee/applications/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes(
        "application/json"
      )
        ? await response.json()
        : {
            success: false,
            message:
              "Server returned an invalid response.",
          };

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update application status."
        );
      }

      setApplication((prev) => ({
        ...prev,
        status:
          data.data?.status ||
          newStatus,
        updatedAt:
          data.data?.updatedAt ||
          prev.updatedAt,
      }));

      setMessage(
        `Application status changed to ${newStatus}.`
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(
        "Update application status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // RESUME
  // =========================================================

  const handleResume = () => {
    if (!application?.resumeFile) {
      setMessage("Resume is not available.");
      return;
    }

    const resumeUrl =
      `${API_BASE_URL}/uploads/applications/${application.resumeFile}`;

    window.open(resumeUrl, "_blank");
  };

  // =========================================================
  // COMPANY NAME
  // =========================================================

  const companyName =
    application?.companyName ||
    application?.job?.companyName ||
    "Company not specified";

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="employee-main">
        <div className="employee-applications-state">
          <RefreshCw
            size={28}
            className="spin"
          />

          <h3>
            Loading Application
          </h3>

          <p>
            Please wait while we load the
            application details.
          </p>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !application) {
    return (
      <main className="employee-main">
        <div className="employee-applications-state error-state">
          <XCircle size={30} />

          <h3>
            Unable to Load Application
          </h3>

          <p>{error}</p>

          <button
            className="employee-retry-btn"
            onClick={fetchApplication}
          >
            Try Again
          </button>

          <button
            className="employee-back-button"
            onClick={() =>
              navigate(
                "/employee-dashboard/applications"
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Applications
          </button>
        </div>
      </main>
    );
  }

  if (!application) {
    return null;
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <main className="employee-main">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="employee-topbar">

        <div>

          <button
            className="employee-back-button"
            onClick={() =>
              navigate(
                "/employee-dashboard/applications"
              )
            }
          >
            <ArrowLeft size={18} />
            Back to Applications
          </button>

          <div className="employee-page-heading">

            <span>
              APPLICATION DETAILS
            </span>

            <h1>
              {application.fullName}
            </h1>

            <p>
              Review candidate information and
              application progress.
            </p>

          </div>

        </div>

        <div
          className={`employee-detail-status ${getStatusClass(
            application.status
          )}`}
        >
          {application.status}
        </div>

      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <div className="employee-detail-message">
          <CheckCircle2 size={17} />
          {message}
        </div>
      )}

      {error && application && (
        <div className="employee-detail-message error-message">
          <XCircle size={17} />
          {error}
        </div>
      )}

      {/* =====================================================
          CANDIDATE PROFILE
      ===================================================== */}

      <section className="employee-detail-profile-card">

        <div className="employee-detail-profile-left">

          <div className="employee-large-avatar">
            {application.fullName
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <span className="employee-detail-label">
              CANDIDATE
            </span>

            <h2>
              {application.fullName}
            </h2>

            <p>
              {application.jobTitle ||
                "Job Application"}
            </p>

            <div className="employee-contact-row">

              <span>
                <Mail size={16} />
                {application.email || "—"}
              </span>

              <span>
                <Phone size={16} />
                {application.phone || "—"}
              </span>

              <span>
                <MapPin size={16} />
                {application.currentLocation ||
                  "—"}
              </span>

            </div>

          </div>

        </div>

        <button
          className="employee-resume-button"
          onClick={handleResume}
          disabled={!application.resumeFile}
        >
          <Download size={17} />
          View Resume
        </button>

      </section>

      {/* =====================================================
          DETAILS GRID
      ===================================================== */}

      <div className="employee-details-grid">

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="employee-details-left">

          {/* =================================================
              CANDIDATE INFORMATION
          ================================================= */}

          <section className="employee-detail-card">

            <div className="employee-card-title">
              <div>
                <span>
                  APPLICATION
                </span>

                <h3>
                  Candidate Information
                </h3>
              </div>
            </div>

            <div className="employee-info-grid">

              <div>
                <span>
                  Candidate Name
                </span>

                <strong>
                  {application.fullName || "—"}
                </strong>
              </div>

              <div>
                <span>
                  Email Address
                </span>

                <strong>
                  {application.email || "—"}
                </strong>
              </div>

              <div>
                <span>
                  Phone Number
                </span>

                <strong>
                  {application.phone || "—"}
                </strong>
              </div>

              <div>
                <span>
                  Experience
                </span>

                <strong>
                  {application.totalExperience ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Current Job Title
                </span>

                <strong>
                  {application.currentJobTitle ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Current Company
                </span>

                <strong>
                  {application.currentCompany ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Location
                </span>

                <strong>
                  {application.currentLocation ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Highest Qualification
                </span>

                <strong>
                  {application.highestQualification ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Preferred Location
                </span>

                <strong>
                  {application.preferredLocation ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Preferred Country
                </span>

                <strong>
                  {application.preferredCountry ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Expected Salary
                </span>

                <strong>
                  {application.expectedSalary ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Notice Period
                </span>

                <strong>
                  {application.noticePeriod ||
                    "—"}
                </strong>
              </div>

            </div>

          </section>

          {/* =================================================
              JOB INFORMATION
          ================================================= */}

          <section className="employee-detail-card">

            <div className="employee-card-title">
              <div>
                <span>
                  JOB
                </span>

                <h3>
                  Job Information
                </h3>
              </div>
            </div>

            <div className="employee-job-detail-box">

              <div className="employee-job-icon">
                <Building2 size={22} />
              </div>

              <div>

                <h4>
                  {application.jobTitle ||
                    application.job?.jobTitle ||
                    "Job Position"}
                </h4>

                {/* DYNAMIC COMPANY NAME */}
                <p>
                  {companyName}
                </p>

                <div className="employee-job-meta">

                  <span>
                    <Briefcase size={15} />
                    Recruitment Position
                  </span>

                  <span>
                    <MapPin size={15} />
                    {application.job?.location ||
                      application.preferredLocation ||
                      application.currentLocation ||
                      "—"}
                  </span>

                  <span>
                    <Calendar size={15} />
                    Applied{" "}
                    {formatDate(
                      application.createdAt
                    )}
                  </span>

                </div>

              </div>

            </div>

            <div className="employee-job-info-grid">

              <div>
                <span>
                  Job ID
                </span>

                <strong>
                  {application.jobId || "—"}
                </strong>
              </div>

              {/* COMPANY NAME */}
              <div>
                <span>
                  Company Name
                </span>

                <strong>
                  {companyName}
                </strong>
              </div>

              <div>
                <span>
                  Application Status
                </span>

                <strong>
                  {application.status || "—"}
                </strong>
              </div>

            </div>

          </section>

          {/* =================================================
              COVER LETTER
          ================================================= */}

          <section className="employee-detail-card">

            <div className="employee-card-title">
              <div>
                <span>
                  CANDIDATE MESSAGE
                </span>

                <h3>
                  Cover Letter
                </h3>
              </div>
            </div>

            <div className="employee-cover-letter">

              <p>
                {application.coverLetter ||
                  "No cover letter was provided by the candidate."}
              </p>

            </div>

          </section>

        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <div className="employee-details-right">

          {/* =================================================
              TIMELINE
          ================================================= */}

          <section className="employee-detail-card">

            <div className="employee-card-title">
              <div>
                <span>
                  WORKFLOW
                </span>

                <h3>
                  Application Timeline
                </h3>
              </div>
            </div>

            <div className="employee-timeline">

              {statusTimeline.map((item) => {
                const Icon = item.icon;

                const state =
                  getTimelineState(
                    item.status,
                    application.status
                  );

                return (
                  <div
                    className={`employee-timeline-item ${state}`}
                    key={item.status}
                  >

                    <div className="employee-timeline-icon">
                      <Icon size={17} />
                    </div>

                    <div className="employee-timeline-content">

                      <strong>
                        {item.label}
                      </strong>

                      <p>
                        {item.description}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

            {application.status ===
              "Rejected" && (
              <div className="employee-rejected-note">

                <XCircle size={18} />

                <div>

                  <strong>
                    Application Rejected
                  </strong>

                  <p>
                    This application has been
                    marked as rejected.
                  </p>

                </div>

              </div>
            )}

          </section>

          {/* =================================================
              UPDATE STATUS
          ================================================= */}

          <section className="employee-detail-card">

            <div className="employee-card-title">
              <div>

                <span>
                  ACTIONS
                </span>

                <h3>
                  Update Status
                </h3>

              </div>
            </div>

            <div className="employee-status-actions">

              {statusOrder.map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  className={`employee-status-action ${getStatusClass(
                    status
                  )} ${
                    application.status === status
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    updateStatus(status)
                  }
                >

                  {status === "Selected" ? (
                    <CheckCircle2 size={16} />
                  ) : status === "Rejected" ? (
                    <XCircle size={16} />
                  ) : status === "Interview" ? (
                    <MessageSquare size={16} />
                  ) : (
                    <Clock3 size={16} />
                  )}

                  {status}

                </button>
              ))}

            </div>

          </section>

          {/* =================================================
              RESUME
          ================================================= */}

          <section className="employee-detail-card">

            <div className="employee-card-title">

              <div>

                <span>
                  RESUME
                </span>

                <h3>
                  Candidate Document
                </h3>

              </div>

            </div>

            <div className="employee-resume-box">

              <div className="employee-file-icon">
                <FileText size={22} />
              </div>

              <div>

                <strong>
                  {application.originalFileName ||
                    application.resumeFile ||
                    "Resume not available"}
                </strong>

                <span>
                  Candidate Resume
                </span>

              </div>

              <button
                onClick={handleResume}
                disabled={!application.resumeFile}
                title="View Resume"
              >
                <Download size={17} />
              </button>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}
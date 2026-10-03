import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Building2,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  CalendarDays,
  IndianRupee,
  Clock3,
  UserRound,
  Globe2,
  RefreshCw,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import "./ApplicationDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rosybrown-snake-826018.hostingersite.com";

const API_URL = `${API_BASE_URL}/api/applications`;

const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* =====================================================
     FETCH APPLICATION
  ===================================================== */

  const fetchApplication = async () => {
    if (!id) {
      setError("Application ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("ragasAdminToken") || "";

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(id)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response. Please check the application API."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Unable to fetch application."
        );
      }

      if (!data.data) {
        throw new Error(
          "Application data was not found."
        );
      }

      setApplication(data.data);
    } catch (err) {
      console.error(
        "Application details error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  const updateStatus = async (newStatus) => {
    if (!application?._id || updatingStatus) {
      return;
    }

    try {
      setUpdatingStatus(true);

      const token =
        localStorage.getItem("ragasAdminToken") || "";

      const response = await fetch(
        `${API_URL}/${application._id}/status`,
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

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response while updating status."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Unable to update status."
        );
      }

      setApplication(
        data.data || {
          ...application,
          status: newStatus,
        }
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      alert(
        err.message ||
          "Unable to update status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     SAFE TEXT HELPER
  ===================================================== */

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      return "—";
    }

    return value;
  };

  /* =====================================================
     COMPANY NAME
     
     Supports different possible backend field names.
  ===================================================== */

  const companyName = useMemo(() => {
    if (!application) {
      return "RAGAS CAREER WORLD";
    }

    return (
      application.companyName ||
      application.company ||
      application.employerName ||
      application.jobCompanyName ||
      application.job?.companyName ||
      application.job?.company ||
      application.job?.employerName ||
      "RAGAS CAREER WORLD"
    );
  }, [application]);

  /* =====================================================
     RESUME URL
     
     IMPORTANT:
     The old code had:
     API_URL + /api/applications/resume
     
     API_URL already contains /api/applications,
     which created an incorrect duplicated URL.
  ===================================================== */

  const resumeUrl = application?.resumeFile
    ? `${API_BASE_URL}/api/applications/resume/${encodeURIComponent(
        application.resumeFile
      )}`
    : null;

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const whatsappNumber = useMemo(() => {
    if (!application?.phone) {
      return "";
    }

    let number = String(
      application.phone
    ).replace(/\D/g, "");

    /*
      If an Indian number is stored as:
      9876543210
      convert it to:
      919876543210
    */

    if (
      number.length === 10 &&
      number.startsWith("6") ||
      number.startsWith("7") ||
      number.startsWith("8") ||
      number.startsWith("9")
    ) {
      number = `91${number}`;
    }

    return number;
  }, [application]);

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "#";

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="application-details-loading">
        <Loader2
          size={38}
          className="application-details-loader-icon"
        />

        <h3>
          Loading candidate details...
        </h3>

        <p>
          Please wait while we fetch the
          application information.
        </p>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !application) {
    return (
      <div className="application-details-error">

        <div className="application-details-error-icon">
          <FileText size={32} />
        </div>

        <h2>
          Unable to load application
        </h2>

        <p>
          {error ||
            "Application not found."}
        </p>

        <div className="application-details-error-actions">

          <button
            type="button"
            onClick={fetchApplication}
            className="application-retry-btn"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/applications"
              )
            }
            className="application-back-error-btn"
          >
            <ArrowLeft size={16} />
            Back to Applications
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="application-details-page">

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        className="application-back-btn"
        onClick={() =>
          navigate(
            "/admin/applications"
          )
        }
      >
        <ArrowLeft size={17} />
        Back to Applications
      </button>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="application-details-header">

        <div className="candidate-main-info">

          <div className="candidate-large-avatar">
            {application.fullName
              ? application.fullName
                  .charAt(0)
                  .toUpperCase()
              : "C"}
          </div>

          <div className="candidate-header-text">

            <p className="details-eyebrow">
              JOB APPLICATION
            </p>

            <h1>
              {application.fullName ||
                "Unknown Candidate"}
            </h1>

            <p className="candidate-applied-job">
              Applied for{" "}
              <strong>
                {application.jobTitle ||
                  "Job Position"}
              </strong>
            </p>

            <p className="candidate-applied-company">
              <Building2 size={15} />

              <span>
                Company:
              </span>

              <strong>
                {companyName}
              </strong>
            </p>

          </div>

        </div>

        {/* STATUS */}

        <div className="application-status-control">

          <label>
            Application Status
          </label>

          <div className="application-status-select-wrapper">

            {updatingStatus ? (
              <Loader2
                size={17}
                className="status-loader"
              />
            ) : (
              <CheckCircle2 size={17} />
            )}

            <select
              value={
                application.status ||
                "Applied"
              }
              onChange={(e) =>
                updateStatus(
                  e.target.value
                )
              }
              disabled={updatingStatus}
            >
              {STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

      </div>

      {/* =================================================
          CONTACT ACTIONS
      ================================================= */}

      <div className="candidate-contact-actions">

        {/* EMAIL */}

        <a
          href={
            application.email
              ? `mailto:${application.email}`
              : "#"
          }
          className={`contact-action email-action ${
            !application.email
              ? "contact-action-disabled"
              : ""
          }`}
          onClick={(e) => {
            if (!application.email) {
              e.preventDefault();
            }
          }}
        >
          <Mail size={21} />

          <div>
            <strong>
              Send Email
            </strong>

            <small>
              {application.email ||
                "No email available"}
            </small>
          </div>
        </a>

        {/* CALL */}

        <a
          href={
            application.phone
              ? `tel:${application.phone}`
              : "#"
          }
          className={`contact-action call-action ${
            !application.phone
              ? "contact-action-disabled"
              : ""
          }`}
          onClick={(e) => {
            if (!application.phone) {
              e.preventDefault();
            }
          }}
        >
          <Phone size={21} />

          <div>
            <strong>
              Call Candidate
            </strong>

            <small>
              {application.phone ||
                "No phone available"}
            </small>
          </div>
        </a>

        {/* WHATSAPP */}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={`contact-action whatsapp-action ${
            !whatsappNumber
              ? "contact-action-disabled"
              : ""
          }`}
          onClick={(e) => {
            if (!whatsappNumber) {
              e.preventDefault();
            }
          }}
        >
          <MessageCircle size={21} />

          <div>
            <strong>
              WhatsApp
            </strong>

            <small>
              {whatsappNumber
                ? "Start conversation"
                : "No phone available"}
            </small>
          </div>
        </a>

        {/* RESUME */}

        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="contact-action resume-action"
          >
            <FileText size={21} />

            <div>
              <strong>
                View Resume
              </strong>

              <small>
                Open candidate resume
              </small>
            </div>

            <ExternalLink
              size={15}
              className="contact-action-external"
            />
          </a>
        )}

      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="application-details-grid">

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="details-card">

          <div className="details-card-header">

            <div className="details-section-icon">
              <UserRound size={18} />
            </div>

            <h2>
              Personal Information
            </h2>

          </div>

          <div className="details-info-grid">

            <div className="details-field">
              <span>
                Full Name
              </span>

              <strong>
                {displayValue(
                  application.fullName
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Email
              </span>

              <strong>
                {displayValue(
                  application.email
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Phone
              </span>

              <strong>
                {displayValue(
                  application.phone
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Date of Birth
              </span>

              <strong>
                {displayValue(
                  application.dateOfBirth
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Current Location
              </span>

              <strong>
                {displayValue(
                  application.currentLocation
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Applied On
              </span>

              <strong>
                {formatDate(
                  application.createdAt
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================================
            PROFESSIONAL INFORMATION
        ================================================= */}

        <section className="details-card">

          <div className="details-card-header">

            <div className="details-section-icon">
              <BriefcaseBusiness size={18} />
            </div>

            <h2>
              Professional Information
            </h2>

          </div>

          <div className="details-info-grid">

            <div className="details-field">
              <span>
                Current Job Title
              </span>

              <strong>
                {displayValue(
                  application.currentJobTitle
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Current Company
              </span>

              <strong>
                {displayValue(
                  application.currentCompany
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Total Experience
              </span>

              <strong>
                {displayValue(
                  application.totalExperience
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Highest Qualification
              </span>

              <strong>
                {displayValue(
                  application.highestQualification
                )}
              </strong>
            </div>

            <div className="details-field full-field">
              <span>
                Key Skills
              </span>

              <strong>
                {displayValue(
                  application.keySkills
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================================
            JOB INFORMATION
        ================================================= */}

        <section className="details-card">

          <div className="details-card-header">

            <div className="details-section-icon">
              <BriefcaseBusiness size={18} />
            </div>

            <h2>
              Job Information
            </h2>

          </div>

          <div className="details-info-grid">

            <div className="details-field">
              <span>
                Job Position
              </span>

              <strong>
                {displayValue(
                  application.jobTitle
                )}
              </strong>
            </div>

            {/* COMPANY NAME */}

            <div className="details-field company-detail-field">
              <span>
                Company Name
              </span>

              <strong className="company-value">
                <Building2 size={15} />
                {companyName}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Job ID
              </span>

              <strong>
                {displayValue(
                  application.jobId
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Preferred Location
              </span>

              <strong>
                {displayValue(
                  application.preferredLocation
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Preferred Country
              </span>

              <strong>
                {displayValue(
                  application.preferredCountry
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Expected Salary
              </span>

              <strong>
                {displayValue(
                  application.expectedSalary
                )}
              </strong>
            </div>

            <div className="details-field">
              <span>
                Notice Period
              </span>

              <strong>
                {displayValue(
                  application.noticePeriod
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================================
            RESUME
        ================================================= */}

        <section className="details-card">

          <div className="details-card-header">

            <div className="details-section-icon">
              <FileText size={18} />
            </div>

            <h2>
              Resume
            </h2>

          </div>

          {application.resumeFile ? (
            <div className="resume-details-box">

              <div className="resume-file-icon">
                PDF
              </div>

              <div className="resume-file-info">

                <strong>
                  {application.resumeFile}
                </strong>

                <span>
                  Candidate uploaded resume
                </span>

              </div>

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-open-btn"
                >
                  <ExternalLink size={15} />
                  Open Resume
                </a>
              )}

            </div>
          ) : (
            <div className="no-resume">
              <FileText size={22} />

              <span>
                No resume was uploaded with
                this application.
              </span>
            </div>
          )}

        </section>

        {/* =================================================
            COVER LETTER
        ================================================= */}

        <section className="details-card details-card-full">

          <div className="details-card-header">

            <div className="details-section-icon">
              <FileText size={18} />
            </div>

            <h2>
              Cover Letter / Message
            </h2>

          </div>

          <div className="cover-letter-content">

            {application.coverLetter ? (
              <p>
                {application.coverLetter}
              </p>
            ) : (
              <span>
                No cover letter or message
                provided.
              </span>
            )}

          </div>

        </section>

      </div>

      {/* =================================================
          BOTTOM CONTACT
      ================================================= */}

      <div className="application-details-footer">

        <div className="application-footer-text">

          <strong>
            Need to contact this candidate?
          </strong>

          <span>
            Use the options above to reach
            the candidate directly.
          </span>

        </div>

        <div className="footer-contact-buttons">

          <a
            href={
              application.email
                ? `mailto:${application.email}`
                : "#"
            }
            className="footer-email-btn"
          >
            <Mail size={16} />
            Email
          </a>

          <a
            href={
              application.phone
                ? `tel:${application.phone}`
                : "#"
            }
            className="footer-call-btn"
          >
            <Phone size={16} />
            Call
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="footer-whatsapp-btn"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}

export default ApplicationDetails;
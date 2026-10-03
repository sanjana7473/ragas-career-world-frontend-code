import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Building2,
  Globe,
  IndianRupee,
  FileDown,
  CheckCircle2,
  Clock3,
  UserRound,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";

import "./EmployeeCandidateDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

const EmployeeCandidateDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("Applied");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* =========================================
     FETCH CANDIDATE DETAILS
  ========================================= */

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "ragasEmployeeToken"
        );

        if (!token) {
          navigate("/employee-login", {
            replace: true,
          });
          return;
        }

        if (!id) {
          throw new Error(
            "Candidate ID is missing."
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/api/employee/applications/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await response.text();

          console.error(
            "Invalid server response:",
            text
          );

          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to load candidate details."
          );
        }

        const candidate =
          data?.data ||
          data?.application ||
          data;

        if (!candidate || !candidate._id) {
          throw new Error(
            "Candidate details were not found."
          );
        }

        /*
         * The backend returns:
         *
         * data.data = application
         * data.job  = related employee job
         *
         * Add companyName from the related job
         * into the application object.
         */
        const companyName =
          data?.job?.companyName ||
          candidate?.companyName ||
          "";

        const updatedCandidate = {
          ...candidate,
          companyName,
        };

        setApplication(updatedCandidate);
        setStatus(
          updatedCandidate.status || "Applied"
        );
      } catch (err) {
        console.error(
          "Candidate details error:",
          err
        );

        setError(
          err.message ||
            "Unable to load candidate details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, navigate]);

  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================
     SKILLS
  ========================================= */

  const skills = useMemo(() => {
    if (!application?.keySkills) {
      return [];
    }

    if (Array.isArray(application.keySkills)) {
      return application.keySkills;
    }

    return application.keySkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [application]);

  /* =========================================
     UPDATE STATUS
  ========================================= */

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      setMessage("");
      setMessageType("");

      const token = localStorage.getItem(
        "ragasEmployeeToken"
      );

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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
          `Server returned an invalid response (${response.status}).`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to update application status."
        );
      }

      setStatus(newStatus);

      setApplication((previous) => ({
        ...previous,
        status: newStatus,
      }));

      setMessage(
        "Candidate status updated successfully."
      );

      setMessageType("success");
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      setMessage(
        err.message ||
          "Unable to update candidate status."
      );

      setMessageType("error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* =========================================
     RESUME
  ========================================= */

  const resumeUrl = application?.resumeFile
    ? `${API_BASE_URL}/uploads/applications/${application.resumeFile}`
    : null;

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="employee-candidate-details-main">
        <div className="employee-candidate-details-loading">
          <Clock3 size={32} />

          <h2>
            Loading candidate details...
          </h2>

          <p>Please wait.</p>
        </div>
      </main>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error || !application) {
    return (
      <main className="employee-candidate-details-main">
        <button
          type="button"
          className="employee-candidate-back-btn"
          onClick={() =>
            navigate(
              "/employee-dashboard/candidates"
            )
          }
        >
          <ArrowLeft size={17} />
          Back to Candidates
        </button>

        <div className="employee-candidate-details-error">
          <BriefcaseBusiness size={40} />

          <h2>
            Unable to load candidate
          </h2>

          <p>
            {error ||
              "Candidate details were not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="employee-candidate-details-main">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="employee-candidate-details-header">
        <div>
          <button
            type="button"
            className="employee-candidate-back-btn"
            onClick={() =>
              navigate(
                "/employee-dashboard/candidates"
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Candidates
          </button>

          <p className="employee-candidate-details-eyebrow">
            CANDIDATE PROFILE
          </p>

          <h1>
            {application.fullName ||
              "Candidate"}
          </h1>

          <p>
            Review candidate information,
            application details and resume.
          </p>
        </div>

        <div className="employee-candidate-details-header-avatar">
          {(application.fullName || "C")
            .charAt(0)
            .toUpperCase()}
        </div>
      </header>

      {/* =========================================
          STATUS + JOB
      ========================================= */}

      <section className="employee-candidate-details-top-grid">

        {/* APPLICATION STATUS */}

        <div className="employee-candidate-details-card">
          <div className="employee-candidate-details-card-title">
            <div className="employee-candidate-details-title-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <h2>Application Status</h2>
              <p>Update candidate progress</p>
            </div>
          </div>

          <div className="employee-candidate-status-control">
            <label>Status</label>

            <select
              value={status}
              disabled={updatingStatus}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value
                )
              }
            >
              {STATUS_OPTIONS.map(
                (statusOption) => (
                  <option
                    key={statusOption}
                    value={statusOption}
                  >
                    {statusOption}
                  </option>
                )
              )}
            </select>
          </div>

          {message && (
            <div
              className={`employee-candidate-details-message ${messageType}`}
            >
              {message}
            </div>
          )}
        </div>

        {/* APPLIED JOB */}

        <div className="employee-candidate-details-card">
          <div className="employee-candidate-details-card-title">
            <div className="employee-candidate-details-title-icon">
              <Briefcase size={18} />
            </div>

            <div>
              <h2>Applied Job</h2>
              <p>Job application information</p>
            </div>
          </div>

          <div className="employee-candidate-job-info">

            <strong>
              {application.jobTitle ||
                "Job Application"}
            </strong>

            {/* COMPANY NAME */}

            <span className="employee-candidate-company">
              <Building2 size={15} />
              <strong>
                {application.companyName ||
                  "Company not specified"}
              </strong>
            </span>

            <span>
              Job ID:{" "}
              {application.jobId || "—"}
            </span>

            <span>
              Applied:{" "}
              {formatDate(
                application.createdAt
              )}
            </span>

          </div>
        </div>

      </section>

      {/* =========================================
          PERSONAL INFORMATION
      ========================================= */}

      <section className="employee-candidate-details-card">
        <div className="employee-candidate-details-card-title">
          <div className="employee-candidate-details-title-icon">
            <UserRound size={18} />
          </div>

          <div>
            <h2>Personal Information</h2>
            <p>Candidate contact details</p>
          </div>
        </div>

        <div className="employee-candidate-details-info-grid">

          <div className="employee-candidate-info-item">
            <Mail size={17} />

            <div>
              <span>Email</span>

              <strong>
                {application.email || "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <Phone size={17} />

            <div>
              <span>Phone</span>

              <strong>
                {application.phone || "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <MapPin size={17} />

            <div>
              <span>Current Location</span>

              <strong>
                {application.currentLocation ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <CalendarDays size={17} />

            <div>
              <span>Date of Birth</span>

              <strong>
                {application.dateOfBirth ||
                  "—"}
              </strong>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          PROFESSIONAL INFORMATION
      ========================================= */}

      <section className="employee-candidate-details-card">

        <div className="employee-candidate-details-card-title">
          <div className="employee-candidate-details-title-icon">
            <BriefcaseBusiness size={18} />
          </div>

          <div>
            <h2>
              Professional Information
            </h2>

            <p>
              Candidate experience and employment
            </p>
          </div>
        </div>

        <div className="employee-candidate-details-info-grid">

          <div className="employee-candidate-info-item">
            <Briefcase size={17} />

            <div>
              <span>Current Job Title</span>

              <strong>
                {application.currentJobTitle ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <Building2 size={17} />

            <div>
              <span>Current Company</span>

              <strong>
                {application.currentCompany ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <Clock3 size={17} />

            <div>
              <span>Total Experience</span>

              <strong>
                {application.totalExperience ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <GraduationCap size={17} />

            <div>
              <span>Highest Qualification</span>

              <strong>
                {application.highestQualification ||
                  "—"}
              </strong>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          JOB PREFERENCES
      ========================================= */}

      <section className="employee-candidate-details-card">

        <div className="employee-candidate-details-card-title">
          <div className="employee-candidate-details-title-icon">
            <Globe size={18} />
          </div>

          <div>
            <h2>Job Preferences</h2>

            <p>
              Candidate's preferred opportunities
            </p>
          </div>
        </div>

        <div className="employee-candidate-details-info-grid">

          <div className="employee-candidate-info-item">
            <MapPin size={17} />

            <div>
              <span>Preferred Location</span>

              <strong>
                {application.preferredLocation ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <Globe size={17} />

            <div>
              <span>Preferred Country</span>

              <strong>
                {application.preferredCountry ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <IndianRupee size={17} />

            <div>
              <span>Expected Salary</span>

              <strong>
                {application.expectedSalary ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="employee-candidate-info-item">
            <Clock3 size={17} />

            <div>
              <span>Notice Period</span>

              <strong>
                {application.noticePeriod ||
                  "—"}
              </strong>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          SKILLS
      ========================================= */}

      <section className="employee-candidate-details-card">

        <div className="employee-candidate-details-card-title">
          <div className="employee-candidate-details-title-icon">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <h2>Key Skills</h2>
            <p>Candidate's listed skills</p>
          </div>
        </div>

        {skills.length > 0 ? (
          <div className="employee-candidate-skills">
            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="employee-candidate-no-data">
            No skills provided.
          </p>
        )}
      </section>

      {/* =========================================
          COVER LETTER
      ========================================= */}

      <section className="employee-candidate-details-card">

        <div className="employee-candidate-details-card-title">
          <div className="employee-candidate-details-title-icon">
            <FileText size={18} />
          </div>

          <div>
            <h2>Cover Letter</h2>

            <p>
              Candidate's application message
            </p>
          </div>
        </div>

        <div className="employee-candidate-cover-letter">
          {application.coverLetter ? (
            <p>
              {application.coverLetter}
            </p>
          ) : (
            <p className="employee-candidate-no-data">
              No cover letter provided.
            </p>
          )}
        </div>

      </section>

      {/* =========================================
          RESUME
      ========================================= */}

      <section className="employee-candidate-details-card">

        <div className="employee-candidate-details-card-title">
          <div className="employee-candidate-details-title-icon">
            <FileDown size={18} />
          </div>

          <div>
            <h2>Resume</h2>

            <p>
              Candidate's uploaded resume
            </p>
          </div>
        </div>

        <div className="employee-candidate-resume">

          <div>
            <strong>
              {application.originalFileName ||
                application.resumeFile ||
                "Resume"}
            </strong>

            <span>
              {application.resumeFile
                ? "Uploaded resume"
                : "No resume uploaded"}
            </span>
          </div>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="employee-candidate-resume-btn"
            >
              <FileDown size={17} />
              View Resume
            </a>
          )}

        </div>

      </section>

      {/* =========================================
          CONTACT ACTIONS
      ========================================= */}

      <section className="employee-candidate-details-actions">

        {application.email && (
          <a
            href={`mailto:${application.email}`}
            className="employee-candidate-action-btn"
          >
            <Mail size={17} />
            Email Candidate
          </a>
        )}

        {application.phone && (
          <a
            href={`tel:${application.phone}`}
            className="employee-candidate-action-btn"
          >
            <Phone size={17} />
            Call Candidate
          </a>
        )}

        <button
          type="button"
          className="employee-candidate-action-btn secondary"
          onClick={() =>
            navigate(
              "/employee-dashboard/candidates"
            )
          }
        >
          <ArrowLeft size={17} />
          Back to Candidates
        </button>

      </section>

    </main>
  );
};

export default EmployeeCandidateDetails;
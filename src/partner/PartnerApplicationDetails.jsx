import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
  Download,
  Building2,
} from "lucide-react";

import "./PartnerApplicationDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const APPLICATIONS_API =
  `${API_BASE_URL}/api/partners/applications`;

const JOBS_API =
  `${API_BASE_URL}/api/partners/jobs`;

function PartnerApplicationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* =========================================================
     SAFE RESPONSE PARSER
  ========================================================= */

  const parseResponse = async (response) => {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error(
        "Invalid JSON response:",
        text
      );

      throw new Error(
        `Server returned an invalid response (${response.status}).`
      );
    }
  };

  /* =========================================================
     FETCH APPLICATION
  ========================================================= */

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "ragasPartnerToken"
        );

      if (!token) {
        setError(
          "Partner authentication required."
        );
        return;
      }

      if (!id) {
        setError(
          "Application ID is missing."
        );
        return;
      }

      const response =
        await fetch(
          `${APPLICATIONS_API}/${id}`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

      const data =
        await parseResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load application."
        );
      }

      const receivedApplication =
        data.application ||
        data.data ||
        data;

      setApplication(
        receivedApplication
      );
    } catch (err) {
      console.error(
        "Fetch application error:",
        err
      );

      setError(
        err.message ||
          "Unable to load application."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH PARTNER JOBS

     Used as fallback for:
     - companyName
     - location
     - jobType
     - industry
  ========================================================= */

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);

      const token =
        localStorage.getItem(
          "ragasPartnerToken"
        );

      if (!token) {
        return;
      }

      const response =
        await fetch(
          JOBS_API,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

      const data =
        await parseResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load jobs."
        );
      }

      const receivedJobs =
        data.jobs ||
        data.data ||
        data.results ||
        (Array.isArray(data)
          ? data
          : []);

      setJobs(
        Array.isArray(
          receivedJobs
        )
          ? receivedJobs
          : []
      );
    } catch (err) {
      console.error(
        "Fetch partner jobs error:",
        err
      );
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
    fetchJobs();
  }, [id]);

  /* =========================================================
     RELATED JOB
  ========================================================= */

  const getApplicationJobId = () => {
    return String(
      application?.jobId ||
        application?.job?._id ||
        application?.job?.id ||
        ""
    );
  };

  const getRelatedJob = () => {
    const applicationJobId =
      getApplicationJobId();

    if (!applicationJobId) {
      return null;
    }

    return (
      jobs.find(
        (job) =>
          String(
            job._id ||
              job.id ||
              ""
          ) === applicationJobId
      ) || null
    );
  };

  /* =========================================================
     CANDIDATE DATA
  ========================================================= */

  const getCandidateName = () => {
    return (
      application?.candidateName ||
      application?.fullName ||
      application?.name ||
      application?.candidate
        ?.fullName ||
      application?.candidate
        ?.name ||
      "Candidate"
    );
  };

  const getEmail = () => {
    return (
      application?.email ||
      application?.candidate
        ?.email ||
      "Not available"
    );
  };

  const getPhone = () => {
    return (
      application?.phone ||
      application?.candidate
        ?.phone ||
      "Not available"
    );
  };

  /* =========================================================
     JOB DATA
  ========================================================= */

  const getJobTitle = () => {
    const relatedJob =
      getRelatedJob();

    return (
      application?.jobTitle ||
      application?.job?.title ||
      application?.job
        ?.jobTitle ||
      relatedJob?.jobTitle ||
      relatedJob?.title ||
      "Job"
    );
  };

  const getCompanyName = () => {
    const relatedJob =
      getRelatedJob();

    return (
      application?.companyName ||
      application?.company ||
      application?.employerName ||
      application?.job
        ?.companyName ||
      application?.job
        ?.company ||
      application?.job
        ?.employerName ||
      relatedJob?.companyName ||
      relatedJob?.company ||
      relatedJob?.employerName ||
      "Company not specified"
    );
  };

  const getLocation = () => {
    const relatedJob =
      getRelatedJob();

    return (
      application?.location ||
      application?.job
        ?.location ||
      relatedJob?.location ||
      "Not specified"
    );
  };

  const getJobType = () => {
    const relatedJob =
      getRelatedJob();

    return (
      application?.jobType ||
      application?.job?.jobType ||
      relatedJob?.jobType ||
      "Not specified"
    );
  };

  const getIndustry = () => {
    const relatedJob =
      getRelatedJob();

    return (
      application?.industry ||
      application?.job?.industry ||
      relatedJob?.industry ||
      relatedJob?.category ||
      "Not specified"
    );
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatus = () => {
    return (
      application?.status ||
      application?.applicationStatus ||
      "Applied"
    );
  };

  const getStatusClass = (
    status
  ) => {
    return String(status)
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );
  };

  /* =========================================================
     DATE
  ========================================================= */

  const getAppliedDate = () => {
    const date =
      application?.createdAt ||
      application?.appliedAt ||
      application?.applicationDate;

    if (!date) {
      return "Not available";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     RESUME
  ========================================================= */

  const getResume = () => {
    if (
      application?.resumeFile
    ) {
      return `${API_BASE_URL}/api/applications/resume/${encodeURIComponent(
        application.resumeFile
      )}`;
    }

    return (
      application?.resumeUrl ||
      application?.resumePath ||
      application?.candidate
        ?.resume ||
      ""
    );
  };

  /* =========================================================
     UPDATE APPLICATION STATUS
     
     BACKEND ROUTE:
     PATCH /api/partners/applications/:id/status

     Allowed by current backend:
     Applied
     Under Review
     Shortlisted
     Interview
     Selected
     Rejected
  ========================================================= */

  const updateStatus = async (
    newStatus
  ) => {
    if (updatingStatus) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const token =
        localStorage.getItem(
          "ragasPartnerToken"
        );

      if (!token) {
        setError(
          "Partner authentication required."
        );
        return;
      }

      if (!id) {
        setError(
          "Application ID is missing."
        );
        return;
      }

      const response =
        await fetch(
          `${APPLICATIONS_API}/${id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      const data =
        await parseResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to update application status (${response.status}).`
        );
      }

      setApplication(
        (previousApplication) => {
          if (
            !previousApplication
          ) {
            return previousApplication;
          }

          return {
            ...previousApplication,
            status: newStatus,
            applicationStatus:
              newStatus,
          };
        }
      );

      /*
        Fetch latest database value.
      */
      await fetchApplication();
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
      setUpdatingStatus(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="partner-application-details-state">

        <User size={30} />

        <h3>
          Loading application...
        </h3>

        <p>
          Please wait while the
          application is loaded.
        </p>

      </div>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!application) {
    return (
      <div className="partner-application-details-state">

        <User size={30} />

        <h3>
          Application not found
        </h3>

        <p>
          {error ||
            "Unable to find this application."}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/partner-dashboard/applications"
            )
          }
        >
          <ArrowLeft size={15} />
          Back to Applications
        </button>

      </div>
    );
  }

  const status =
    getStatus();

  const resume =
    getResume();

  const statusClass =
    getStatusClass(status);

  const companyName =
    getCompanyName();

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="partner-application-details">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="partner-application-details-header">

        <div>

          <button
            type="button"
            className="partner-application-back-btn"
            onClick={() =>
              navigate(
                "/partner-dashboard/applications"
              )
            }
          >
            <ArrowLeft size={15} />
            Back to Applications
          </button>

          <p className="partner-application-eyebrow">
            APPLICATION DETAILS
          </p>

          <h2>
            {getCandidateName()}
          </h2>

          <p className="partner-application-job">
            Applied for{" "}
            <strong>
              {getJobTitle()}
            </strong>
          </p>

          <p className="partner-application-job">
            <Building2 size={15} />
            <strong>
              {companyName}
            </strong>
          </p>

        </div>

        <div
          className={`partner-application-large-status partner-large-status-${statusClass}`}
        >
          {status}
        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="partner-application-error">
          {error}
        </div>
      )}

      {/* =====================================================
          QUICK INFORMATION
      ===================================================== */}

      <div className="partner-application-info-grid">

        {/* EMAIL */}

        <div className="partner-application-info-card">

          <div className="partner-application-info-icon">
            <Mail size={18} />
          </div>

          <div>
            <span>
              Email
            </span>

            <strong>
              {getEmail()}
            </strong>
          </div>

        </div>

        {/* PHONE */}

        <div className="partner-application-info-card">

          <div className="partner-application-info-icon">
            <Phone size={18} />
          </div>

          <div>
            <span>
              Phone
            </span>

            <strong>
              {getPhone()}
            </strong>
          </div>

        </div>

        {/* COMPANY */}

        <div className="partner-application-info-card">

          <div className="partner-application-info-icon">
            <Building2 size={18} />
          </div>

          <div>
            <span>
              Company
            </span>

            <strong>
              {companyName}
            </strong>
          </div>

        </div>

        {/* APPLIED DATE */}

        <div className="partner-application-info-card">

          <div className="partner-application-info-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>
              Applied On
            </span>

            <strong>
              {getAppliedDate()}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="partner-application-details-layout">

        {/* ===================================================
            MAIN
        =================================================== */}

        <main className="partner-application-main">

          {/* =================================================
              CANDIDATE INFORMATION
          ================================================= */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">

              <User size={18} />

              <div>

                <h3>
                  Candidate Information
                </h3>

                <p>
                  Personal information provided
                  by the candidate.
                </p>

              </div>

            </div>

            <div className="partner-candidate-fields">

              <div>
                <span>
                  Full Name
                </span>

                <strong>
                  {getCandidateName()}
                </strong>
              </div>

              <div>
                <span>
                  Email Address
                </span>

                <strong>
                  {getEmail()}
                </strong>
              </div>

              <div>
                <span>
                  Phone Number
                </span>

                <strong>
                  {getPhone()}
                </strong>
              </div>

              <div>
                <span>
                  Location
                </span>

                <strong>
                  {getLocation()}
                </strong>
              </div>

            </div>

          </section>

          {/* =================================================
              JOB INFORMATION
          ================================================= */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">

              <BriefcaseBusiness size={18} />

              <div>

                <h3>
                  Job Information
                </h3>

                <p>
                  Position for which the candidate
                  applied.
                </p>

              </div>

            </div>

            <div className="partner-candidate-fields">

              <div>

                <span>
                  Position
                </span>

                <strong>
                  {getJobTitle()}
                </strong>

              </div>

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
                  Job Location
                </span>

                <strong>
                  {getLocation()}
                </strong>

              </div>

              <div>

                <span>
                  Job Type
                </span>

                <strong>
                  {getJobType()}
                </strong>

              </div>

              <div>

                <span>
                  Industry
                </span>

                <strong>
                  {getIndustry()}
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              CANDIDATE MESSAGE
          ================================================= */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">

              <FileText size={18} />

              <div>

                <h3>
                  Candidate Message
                </h3>

                <p>
                  Message or cover letter submitted
                  with the application.
                </p>

              </div>

            </div>

            <div className="partner-candidate-message">

              {application.coverLetter ||
              application.message ||
              application.cover_letter ? (

                <p>
                  {application.coverLetter ||
                    application.message ||
                    application.cover_letter}
                </p>

              ) : (

                <p className="partner-application-muted">
                  No message or cover letter was
                  provided.
                </p>

              )}

            </div>

          </section>

          {/* =================================================
              RESUME
          ================================================= */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">

              <FileText size={18} />

              <div>

                <h3>
                  Resume
                </h3>

                <p>
                  Candidate resume submitted with
                  this application.
                </p>

              </div>

            </div>

            {resume ? (

              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-resume-btn"
              >
                <Download size={16} />
                View / Download Resume
              </a>

            ) : (

              <p className="partner-application-muted">
                No resume is available for this
                application.
              </p>

            )}

          </section>

        </main>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="partner-application-side">

          {/* =================================================
              APPLICATION STATUS
          ================================================= */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">

              <Clock3 size={18} />

              <div>

                <h3>
                  Application Status
                </h3>

                <p>
                  Update the candidate's progress.
                </p>

              </div>

            </div>

            <div className="partner-status-actions">

              {/* SHORTLIST */}

              <button
                type="button"
                className="partner-status-action shortlist"
                disabled={updatingStatus}
                onClick={() =>
                  updateStatus(
                    "Shortlisted"
                  )
                }
              >

                <CheckCircle2
                  size={16}
                />

                {updatingStatus &&
                status ===
                  "Shortlisted"
                  ? "Updating..."
                  : "Shortlist"}

              </button>

              {/* SELECT */}

              <button
                type="button"
                className="partner-status-action hired"
                disabled={updatingStatus}
                onClick={() =>
                  updateStatus(
                    "Selected"
                  )
                }
              >

                <CheckCircle2
                  size={16}
                />

                {updatingStatus &&
                status ===
                  "Selected"
                  ? "Updating..."
                  : "Mark as Selected"}

              </button>

              {/* REJECT */}

              <button
                type="button"
                className="partner-status-action reject"
                disabled={updatingStatus}
                onClick={() =>
                  updateStatus(
                    "Rejected"
                  )
                }
              >

                <XCircle size={16} />

                {updatingStatus &&
                status ===
                  "Rejected"
                  ? "Updating..."
                  : "Reject"}

              </button>

              {/* UNDER REVIEW */}

              <button
                type="button"
                className="partner-status-action pending"
                disabled={updatingStatus}
                onClick={() =>
                  updateStatus(
                    "Under Review"
                  )
                }
              >

                <Clock3 size={16} />

                {updatingStatus &&
                status ===
                  "Under Review"
                  ? "Updating..."
                  : "Move to Under Review"}

              </button>

            </div>

          </section>

          {/* =================================================
              APPLICATION TIMELINE
          ================================================= */}

          <section className="partner-application-card">

            <div className="partner-application-card-heading">

              <CalendarDays size={18} />

              <div>

                <h3>
                  Application Timeline
                </h3>

              </div>

            </div>

            <div className="partner-application-timeline">

              {/* RECEIVED */}

              <div className="partner-timeline-item">

                <div className="partner-timeline-dot">
                  <CheckCircle2
                    size={13}
                  />
                </div>

                <div>

                  <strong>
                    Application Received
                  </strong>

                  <span>
                    {getAppliedDate()}
                  </span>

                </div>

              </div>

              {/* CURRENT STATUS */}

              <div className="partner-timeline-item">

                <div className="partner-timeline-dot">
                  <Clock3 size={13} />
                </div>

                <div>

                  <strong>
                    Current Status
                  </strong>

                  <span>
                    {status}
                  </span>

                </div>

              </div>

              {/* COMPANY */}

              <div className="partner-timeline-item">

                <div className="partner-timeline-dot">
                  <Building2
                    size={13}
                  />
                </div>

                <div>

                  <strong>
                    Company
                  </strong>

                  <span>
                    {companyName}
                  </span>

                </div>

              </div>

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default PartnerApplicationDetails;
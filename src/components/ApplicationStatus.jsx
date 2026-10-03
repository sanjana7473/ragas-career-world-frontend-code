import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Eye,
  Award,
  Calendar,
  XCircle,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  Loader2,
} from "lucide-react";

import "./ApplicationStatus.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function ApplicationStatus() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =====================================================
     GET COMPANY NAME
  ===================================================== */

  const getCompanyName = (app) => {
    /*
      IMPORTANT:
      DO NOT use app.currentCompany here.

      currentCompany = candidate's current company
      companyName = company whose job candidate applied for
    */

    const companyName =
      app?.companyName ||
      app?.company?.companyName ||
      app?.company?.name ||
      app?.employerName ||
      app?.employer?.companyName ||
      app?.employer?.name ||
      app?.job?.companyName ||
      app?.job?.company?.companyName ||
      app?.job?.company?.name ||
      app?.job?.employerName ||
      app?.jobDetails?.companyName ||
      app?.jobDetails?.company?.companyName ||
      app?.jobDetails?.company?.name ||
      "";

    return String(companyName).trim();
  };

  /* =====================================================
     GET LOCATION
  ===================================================== */

  const getJobLocation = (app) => {
    return (
      app?.jobLocation ||
      app?.location ||
      app?.job?.location ||
      app?.job?.jobLocation ||
      app?.jobDetails?.location ||
      app?.currentLocation ||
      ""
    );
  };

  /* =====================================================
     FETCH APPLICATIONS
  ===================================================== */

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        /* ===============================================
           GET SAVED USER
        =============================================== */

        const savedUser =
          localStorage.getItem("ragasUser") ||
          sessionStorage.getItem("ragasUser");

        /* ===============================================
           GET TOKEN
        =============================================== */

        const token =
          localStorage.getItem("ragasUserToken") ||
          sessionStorage.getItem("ragasUserToken");

        /* ===============================================
           AUTH CHECK
        =============================================== */

        if (!savedUser || !token) {
          setLoading(false);
          setError("Authentication required.");

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

        /* ===============================================
           PARSE USER
        =============================================== */

        let user;

        try {
          user = JSON.parse(savedUser);
        } catch (parseError) {
          console.error(
            "Invalid saved user data:",
            parseError
          );

          localStorage.removeItem("ragasUser");
          sessionStorage.removeItem("ragasUser");

          setLoading(false);

          setError(
            "Your login session is invalid. Please log in again."
          );

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

        /* ===============================================
           USER EMAIL
        =============================================== */

        const userEmail = String(user?.email || "")
          .trim()
          .toLowerCase();

        if (!userEmail) {
          setLoading(false);

          setError(
            "User email not found. Please log in again."
          );

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

        /* ===============================================
           API REQUEST
        =============================================== */

        const response = await fetch(
          `${API_BASE_URL}/api/applications/candidate?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        /* ===============================================
           CHECK CONTENT TYPE
        =============================================== */

        const contentType =
          response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error(
            "Invalid server response. Please check the API connection."
          );
        }

        /* ===============================================
           RESPONSE
        =============================================== */

        const data = await response.json();

        console.log(
          "===================================="
        );

        console.log(
          "APPLICATION STATUS API RESPONSE"
        );

        console.log(
          "Candidate:",
          userEmail
        );

        console.log(
          "API URL:",
          `${API_BASE_URL}/api/applications/candidate`
        );

        console.log(
          "Response:",
          data
        );

        /* ===============================================
           DEBUG APPLICATION DATA
        =============================================== */

        if (Array.isArray(data?.data)) {
          data.data.forEach((app) => {
            console.log(
              "APPLICATION DETAILS:",
              {
                id: app?._id,

                jobTitle:
                  app?.jobTitle,

                status:
                  app?.status,

                email:
                  app?.email,

                /* JOB COMPANY */

                companyName:
                  app?.companyName,

                company:
                  app?.company,

                employerName:
                  app?.employerName,

                employer:
                  app?.employer,

                job:
                  app?.job,

                jobDetails:
                  app?.jobDetails,

                /* CANDIDATE COMPANY */

                currentCompany:
                  app?.currentCompany,
              }
            );

            console.log(
              "JOB COMPANY USED:",
              getCompanyName(app)
            );
          });
        }

        console.log(
          "===================================="
        );

        /* ===============================================
           AUTH ERROR
        =============================================== */

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "ragasUserToken"
          );

          sessionStorage.removeItem(
            "ragasUserToken"
          );

          setError(
            "Your login session has expired. Please log in again."
          );

          setTimeout(() => {
            navigate("/user-login");
          }, 1200);

          return;
        }

        /* ===============================================
           API ERROR
        =============================================== */

        if (!response.ok || !data.success) {
          setError(
            data.message ||
              "Failed to load application status."
          );

          return;
        }

        /* ===============================================
           APPLICATION DATA
        =============================================== */

        const applicationData =
          Array.isArray(data.data)
            ? data.data
            : [];

        setApplications(applicationData);

      } catch (err) {
        console.error(
          "Application status fetch error:",
          err
        );

        setError(
          err?.message ||
            "Something went wrong connecting to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  /* =====================================================
     NORMALIZE STATUS
  ===================================================== */

  const normalizeStatus = (status) => {
    return String(status || "Applied")
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     STATUS STAGES
  ===================================================== */

  const getStageFlags = (status) => {
    const s = normalizeStatus(status);

    const isRejected =
      s === "rejected";

    const isSelected =
      s === "selected";

    const isShortlisted =
      s === "shortlisted" ||
      s === "interview" ||
      s === "selected";

    const isInterview =
      s === "interview" ||
      s === "selected";

    const isUnderReview = [
      "under review",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
    ].includes(s);

    return {
      applied: true,

      viewed: isUnderReview,

      shortlisted:
        isShortlisted,

      interview:
        isInterview,

      selected:
        isSelected,

      rejected:
        isRejected,
    };
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="application-status-page">
        <div className="status-container">

          <div
            className="status-loading"
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            <Loader2
              className="spinner"
              size={32}
              style={{
                animation:
                  "spin 1s linear infinite",
              }}
            />

            <p
              style={{
                marginTop: "10px",
              }}
            >
              Loading your application statuses...
            </p>

          </div>

        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="application-status-page">

      <div className="status-container">

        {/* ===============================================
            BACK BUTTON
        =============================================== */}

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="status-header">

          <h1>
            My Job Application Status
          </h1>

          <p>
            Track the live progress of your job
            applications submitted through RAGAS.
          </p>

        </div>

        {/* ===============================================
            ERROR
        =============================================== */}

        {error ? (

          <div
            className="status-error-box"
            style={{
              padding: "20px",
              color: "red",
              textAlign: "center",
            }}
          >
            <p>{error}</p>
          </div>

        ) : applications.length === 0 ? (

          /* =============================================
             NO APPLICATIONS
          ============================================= */

          <div
            className="no-applications-box"
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >

            <Briefcase
              size={48}
              style={{
                opacity: 0.5,
                marginBottom: "15px",
              }}
            />

            <h3>
              No Applications Found
            </h3>

            <p>
              You haven't applied to any jobs yet.
              Check out current openings to apply!
            </p>

            <button
              className="browse-jobs-btn"
              onClick={() =>
                navigate("/current-openings")
              }
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Browse Openings
            </button>

          </div>

        ) : (

          /* =============================================
             APPLICATION LIST
          ============================================= */

          <div className="applications-list">

            {applications.map((app) => {

              /* =========================================
                 STATUS
              ========================================= */

              const stages =
                getStageFlags(app.status);

              const rawStatus =
                String(
                  app.status || "Applied"
                ).trim();

              const normalizedStatus =
                normalizeStatus(
                  app.status
                );

              const isRejected =
                normalizedStatus ===
                "rejected";

              /* =========================================
                 COMPANY
              ========================================= */

              const companyName =
                getCompanyName(app);

              /* =========================================
                 LOCATION
              ========================================= */

              const jobLocation =
                getJobLocation(app);

              /* =========================================
                 DEBUG
              ========================================= */

              console.log(
                "RENDERING APPLICATION:",
                {
                  id: app?._id,

                  jobTitle:
                    app?.jobTitle,

                  status:
                    rawStatus,

                  companyName:
                    companyName,

                  jobLocation:
                    jobLocation,

                  currentCompany:
                    app?.currentCompany,
                }
              );

              return (
                <div
                  key={app._id}
                  className="application-card"
                >

                  {/* ===================================
                      CARD TOP
                  =================================== */}

                  <div className="app-card-top">

                    <div className="job-meta">

                      <span className="job-icon-box">
                        <Briefcase size={20} />
                      </span>

                      <div>

                        {/* JOB TITLE */}

                        <h2>
                          {app.jobTitle ||
                            app.job?.jobTitle ||
                            app.job?.title ||
                            app.jobDetails?.jobTitle ||
                            app.jobDetails?.title ||
                            "Job Application"}
                        </h2>

                        {/* =================================
                            CORRECT COMPANY
                        ================================= */}

                        <p className="app-company">

                          {companyName ||
                            "Company information unavailable"}

                          {jobLocation
                            ? ` • ${jobLocation}`
                            : ""}

                        </p>

                        {/* DATE */}

                        <span className="app-date">

                          Applied on:{" "}

                          {app.createdAt
                            ? new Date(
                                app.createdAt
                              ).toLocaleDateString()
                            : "Date unavailable"}

                        </span>

                      </div>

                    </div>

                    {/* =================================
                        STATUS
                    ================================= */}

                    <span
                      className={`status-pill ${normalizedStatus.replace(
                        /\s+/g,
                        "-"
                      )}`}
                    >
                      {rawStatus}
                    </span>

                  </div>

                  {/* ===================================
                      TRACKER
                  =================================== */}

                  <div className="tracker-steps">

                    {/* APPLIED */}

                    <div
                      className={`tracker-step ${
                        stages.applied
                          ? "completed"
                          : ""
                      }`}
                    >
                      <div className="step-circle">
                        <CheckCircle2 size={16} />
                      </div>

                      <span>
                        Applied
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.viewed
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* UNDER REVIEW */}

                    <div
                      className={`tracker-step ${
                        stages.viewed
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      <div className="step-circle">
                        <Eye size={16} />
                      </div>

                      <span>
                        Under Review
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.shortlisted
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* SHORTLISTED */}

                    <div
                      className={`tracker-step ${
                        stages.shortlisted
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      <div className="step-circle">
                        <Award size={16} />
                      </div>

                      <span>
                        Shortlisted
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.interview
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* INTERVIEW */}

                    <div
                      className={`tracker-step ${
                        stages.interview
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      <div className="step-circle">
                        <Calendar size={16} />
                      </div>

                      <span>
                        Interview
                      </span>
                    </div>

                    {/* LINE */}

                    <div
                      className={`tracker-line ${
                        stages.selected ||
                        stages.rejected
                          ? "completed"
                          : ""
                      }`}
                    />

                    {/* FINAL STATUS */}

                    <div
                      className={`tracker-step ${
                        stages.selected
                          ? "completed"
                          : stages.rejected
                          ? "rejected"
                          : "pending"
                      }`}
                    >

                      <div className="step-circle">

                        {stages.selected ? (

                          <CheckCircle
                            size={16}
                          />

                        ) : stages.rejected ? (

                          <XCircle
                            size={16}
                          />

                        ) : (

                          <Calendar
                            size={16}
                          />

                        )}

                      </div>

                      <span>
                        {isRejected
                          ? "Rejected"
                          : "Selected"}
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default ApplicationStatus;
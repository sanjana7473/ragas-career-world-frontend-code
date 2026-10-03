import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  FileText,
  Clock3,
  UserCheck,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  PlusCircle,
  MapPin,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./EmployeeDashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employee = useMemo(() => {
    try {
      const savedEmployee =
        localStorage.getItem("ragasEmployee");

      if (savedEmployee) {
        return JSON.parse(savedEmployee);
      }
    } catch (error) {
      console.error("Invalid employee data:", error);
    }

    return null;
  }, []);

  const employeeName =
    dashboardData?.employee?.name ||
    employee?.name ||
    "Employee";

  const employeeDesignation =
    dashboardData?.employee?.designation ||
    employee?.designation ||
    "Recruitment Employee";

  /* =====================================================
     FETCH DASHBOARD DATA
  ===================================================== */

  useEffect(() => {
    const fetchDashboard = async () => {
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

        const response = await fetch(
          `${API_BASE_URL}/api/employee/jobs/dashboard-summary`,
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

        let data;

        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          await response.text();

          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "ragasEmployeeToken"
          );
          localStorage.removeItem(
            "ragasEmployeeLoggedIn"
          );
          localStorage.removeItem("ragasEmployee");
          localStorage.removeItem("ragasUserRole");

          navigate("/employee-login", {
            replace: true,
          });

          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load dashboard."
          );
        }

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Unable to load dashboard."
          );
        }

        setDashboardData(data);
      } catch (error) {
        console.error(
          "Employee dashboard fetch error:",
          error
        );

        setError(
          error.message ||
            "Unable to load dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  /* =====================================================
     DATA
  ===================================================== */

  const statsData = dashboardData?.stats || {};

  const recentApplications =
    dashboardData?.recentApplications || [];

  const recentJobs =
    dashboardData?.recentJobs || [];

  /* =====================================================
     STATS
  ===================================================== */

  const stats = [
    {
      title: "My Jobs",
      value: statsData.totalJobs ?? 0,
      subtitle: "Jobs created by you",
      icon: BriefcaseBusiness,
    },
    {
      title: "Active Jobs",
      value: statsData.activeJobs ?? 0,
      subtitle: "Currently active",
      icon: LayoutDashboard,
    },
    {
      title: "Applications",
      value: statsData.totalApplications ?? 0,
      subtitle: "Total applications",
      icon: FileText,
    },
    {
      title: "Pending Review",
      value:
        (statsData.appliedApplications || 0) +
        (statsData.underReviewApplications || 0),
      subtitle: "Awaiting action",
      icon: Clock3,
    },
    {
      title: "Shortlisted",
      value:
        statsData.shortlistedApplications ?? 0,
      subtitle: "Candidates shortlisted",
      icon: UserCheck,
    },
    {
      title: "Interviews",
      value:
        statsData.interviewApplications ?? 0,
      subtitle: "Interview stage",
      icon: CalendarDays,
    },
    {
      title: "Selected / Hired",
      value:
        statsData.selectedApplications ?? 0,
      subtitle: "Successfully selected",
      icon: CheckCircle2,
    },
  ];

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

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

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "approved";

      case "Pending":
        return "pending";

      case "Draft":
        return "draft";

      case "Closed":
        return "closed";

      case "Rejected":
        return "rejected";

      case "Shortlisted":
        return "shortlisted";

      case "Interview":
        return "interview";

      case "Selected":
        return "selected";

      case "Under Review":
        return "review";

      case "Applied":
        return "applied";

      default:
        return "";
    }
  };

  /* =====================================================
     RETRY
  ===================================================== */

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="employee-dashboard">

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="employee-main">

        {/* HEADER */}

        <header className="employee-topbar">

          <div>
            <p className="employee-eyebrow">
            AGENT PORTAL
            </p>

            <h1>
              Welcome back, {employeeName}
            </h1>

            <p className="employee-header-text">
              Manage your jobs, applications and
              candidates from one place.
            </p>
          </div>

          <div className="employee-top-profile">

            <div className="employee-top-avatar">
              {employeeName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{employeeName}</strong>

              <span>
                {employeeDesignation}
              </span>
            </div>

          </div>

        </header>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="employee-dashboard-error">

            <div>
              <AlertCircle size={20} />

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={handleRetry}
            >
              Retry
            </button>

          </div>
        )}

        {/* =========================================
            POST A JOB
        ========================================= */}

        <section className="employee-post-job-banner">

          <div className="employee-post-job-banner-left">

            <div className="employee-post-job-banner-icon">
              <PlusCircle size={25} />
            </div>

            <div>
              <p>CREATE NEW OPENING</p>

              <h2>Post a New Job</h2>

              <span>
                Create a job opening, define the
                requirements and start receiving
                candidates.
              </span>
            </div>

          </div>

          <button
            type="button"
            className="employee-post-job-banner-button"
            onClick={() =>
              navigate(
                "/employee-dashboard/post-job"
              )
            }
          >
            Post a Job
            <ArrowRight size={17} />
          </button>

        </section>

        {/* =========================================
            STATS
        ========================================= */}

        <section className="employee-stats-grid">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="employee-stat-card"
                key={stat.title}
              >

                <div className="employee-stat-top">

                  <div className="employee-stat-icon">
                    <Icon size={20} />
                  </div>

                </div>

                <div className="employee-stat-value">
                  {loading ? "—" : stat.value}
                </div>

                <h3>{stat.title}</h3>

                <p>{stat.subtitle}</p>

              </div>
            );
          })}

        </section>

        {/* =========================================
            QUICK ACTIONS
        ========================================= */}

        <section className="employee-section">

          <div className="employee-section-heading">

            <div>
              <p>WORKSPACE</p>
              <h2>Quick Actions</h2>
            </div>

          </div>

          <div className="employee-action-grid">

            {/* POST JOB */}

            <button
              type="button"
              className="employee-action-card"
              onClick={() =>
                navigate(
                  "/employee-dashboard/post-job"
                )
              }
            >
              <div className="employee-action-icon">
                <PlusCircle size={21} />
              </div>

              <div>
                <strong>
                  Post a New Job
                </strong>

                <span>
                  Create and publish a new job
                  opening.
                </span>
              </div>

              <ArrowRight size={18} />
            </button>

            {/* JOBS */}

            <button
              type="button"
              className="employee-action-card"
              onClick={() =>
                navigate(
                  "/employee-dashboard/jobs"
                )
              }
            >
              <div className="employee-action-icon">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <strong>
                  View My Jobs
                </strong>

                <span>
                  See jobs currently created by
                  you.
                </span>
              </div>

              <ArrowRight size={18} />
            </button>

            {/* APPLICATIONS */}

            <button
              type="button"
              className="employee-action-card"
              onClick={() =>
                navigate(
                  "/employee-dashboard/applications"
                )
              }
            >
              <div className="employee-action-icon">
                <FileText size={21} />
              </div>

              <div>
                <strong>
                  Review Applications
                </strong>

                <span>
                  Check candidates and update
                  application status.
                </span>
              </div>

              <ArrowRight size={18} />
            </button>

            {/* CANDIDATES */}

            <button
              type="button"
              className="employee-action-card"
              onClick={() =>
                navigate(
                  "/employee-dashboard/candidates"
                )
              }
            >
              <div className="employee-action-icon">
                <Users size={21} />
              </div>

              <div>
                <strong>
                  View Candidates
                </strong>

                <span>
                  Review candidate information and
                  resumes.
                </span>
              </div>

              <ArrowRight size={18} />
            </button>

          </div>
        </section>

        {/* =========================================
            RECENT APPLICATIONS
        ========================================= */}

        <section className="employee-section">

          <div className="employee-section-heading">

            <div>
              <p>ACTIVITY</p>
              <h2>Recent Applications</h2>
            </div>

            <button
              type="button"
              className="employee-view-all"
              onClick={() =>
                navigate(
                  "/employee-dashboard/applications"
                )
              }
            >
              View All
              <ArrowRight size={15} />
            </button>

          </div>

          {loading ? (
            <div className="employee-empty-state">

              <div className="employee-empty-icon">
                <FileText size={25} />
              </div>

              <h3>
                Loading applications...
              </h3>

              <p>
                Please wait while we load your
                latest applications.
              </p>

            </div>
          ) : recentApplications.length === 0 ? (
            <div className="employee-empty-state">

              <div className="employee-empty-icon">
                <FileText size={25} />
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Applications from candidates for
                your jobs will appear here.
              </p>

            </div>
          ) : (
            <div className="employee-recent-list">

              {recentApplications.map(
                (application) => (
                  <div
                    className="employee-recent-item"
                    key={application._id}
                  >

                    <div className="employee-recent-avatar">
                      {(
                        application.fullName ||
                        "C"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="employee-recent-info">

                      <strong>
                        {application.fullName ||
                          "Unnamed Candidate"}
                      </strong>

                      <span>
                        {application.jobTitle ||
                          "Job Application"}
                      </span>

                      <small>
                        {application.email ||
                          "—"}
                      </small>

                    </div>

                    <div className="employee-recent-company">

                      <Building2 size={14} />

                      <span>
                        {application.companyName ||
                          "—"}
                      </span>

                    </div>

                    <div className="employee-recent-date">

                      <CalendarDays size={14} />

                      <span>
                        {formatDate(
                          application.createdAt
                        )}
                      </span>

                    </div>

                    <span
                      className={`employee-status-badge ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {application.status ||
                        "Applied"}
                    </span>

                    <button
                      type="button"
                      className="employee-recent-view"
                      onClick={() =>
                        navigate(
                          `/employee-dashboard/applications/${application._id}`
                        )
                      }
                    >
                      View
                      <ArrowRight size={14} />
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =========================================
            RECENT JOBS
        ========================================= */}

        <section className="employee-section">

          <div className="employee-section-heading">

            <div>
              <p>JOBS</p>
              <h2>Recent Jobs</h2>
            </div>

            <button
              type="button"
              className="employee-view-all"
              onClick={() =>
                navigate(
                  "/employee-dashboard/jobs"
                )
              }
            >
              View All
              <ArrowRight size={15} />
            </button>

          </div>

          {loading ? (
            <div className="employee-empty-state">

              <div className="employee-empty-icon">
                <BriefcaseBusiness size={25} />
              </div>

              <h3>
                Loading jobs...
              </h3>

              <p>
                Please wait while we load your
                latest jobs.
              </p>

            </div>
          ) : recentJobs.length === 0 ? (
            <div className="employee-empty-state">

              <div className="employee-empty-icon">
                <BriefcaseBusiness size={25} />
              </div>

              <h3>
                No jobs created yet
              </h3>

              <p>
                Create your first job opening to
                start receiving applications.
              </p>

              <button
                type="button"
                className="employee-dashboard-create-button"
                onClick={() =>
                  navigate(
                    "/employee-dashboard/post-job"
                  )
                }
              >
                <PlusCircle size={16} />
                Post a Job
              </button>

            </div>
          ) : (
            <div className="employee-recent-list">

              {recentJobs.map((job) => (
                <div
                  className="employee-recent-item"
                  key={job._id}
                >

                  <div className="employee-recent-avatar job">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <div className="employee-recent-info">

                    <strong>
                      {job.jobTitle ||
                        "Untitled Job"}
                    </strong>

                    <span>
                      {job.companyName ||
                        "—"}
                    </span>

                    <small>
                      {job.jobType ||
                        "Job"}
                    </small>

                  </div>

                  <div className="employee-recent-company">

                    <MapPin size={14} />

                    <span>
                      {job.location ||
                        "—"}
                    </span>

                  </div>

                  <div className="employee-recent-date">

                    <CalendarDays size={14} />

                    <span>
                      {formatDate(
                        job.createdAt
                      )}
                    </span>

                  </div>

                  <span
                    className={`employee-status-badge ${getStatusClass(
                      job.status
                    )}`}
                  >
                    {job.status ||
                      "Pending"}
                  </span>

                  <button
                    type="button"
                    className="employee-recent-view"
                    onClick={() =>
                      navigate(
                        `/employee-dashboard/jobs/${job._id}`
                      )
                    }
                  >
                    View
                    <ArrowRight size={14} />
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default EmployeeDashboard;
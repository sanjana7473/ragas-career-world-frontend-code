import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Search,
  MapPin,
  Clock3,
  Users,
  Eye,
  FileText,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "./EmployeeJobs.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_URL =
  `${API_BASE_URL}/api/employee/jobs`;

const EmployeeJobs = () => {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================
  // FETCH EMPLOYEE JOBS
  // =========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "ragasEmployeeToken"
        );

      if (!token) {
        throw new Error(
          "Employee authentication required. Please log in again."
        );
      }

      console.log(
        "Employee Jobs API:",
        API_URL
      );

      const response = await fetch(
        API_URL,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let data = {};

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      } else {
        const text =
          await response.text();

        throw new Error(
          `Server returned ${response.status}. ${
            text ||
            "Unexpected server response."
          }`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load your jobs."
        );
      }

      const receivedJobs =
        Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.jobs)
          ? data.jobs
          : [];

      setJobs(receivedJobs);

      console.log(
        "Employee jobs received:",
        receivedJobs
      );
    } catch (err) {
      console.error(
        "Employee jobs fetch error:",
        err
      );

      setJobs([]);

      setError(
        err.message ||
          "Unable to load your jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD JOBS
  // =========================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================================
  // SEARCH + STATUS FILTER
  // =========================================

  const filteredJobs = useMemo(() => {
    const searchValue =
      search
        .toLowerCase()
        .trim();

    return jobs.filter((job) => {
      const title =
        job.jobTitle ||
        job.title ||
        "";

      const company =
        job.companyName ||
        job.company ||
        "";

      const location =
        job.location ||
        "";

      const jobStatus =
        job.status ||
        "Pending";

      const matchesSearch =
        !searchValue ||
        title
          .toLowerCase()
          .includes(searchValue) ||
        company
          .toLowerCase()
          .includes(searchValue) ||
        location
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        jobStatus ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    jobs,
    search,
    statusFilter,
  ]);

  // =========================================
  // SUMMARY
  // =========================================

  const totalJobs =
    jobs.length;

  const approvedJobs =
    jobs.filter(
      (job) =>
        job.status ===
        "Approved"
    ).length;

  const pendingJobs =
    jobs.filter(
      (job) =>
        job.status ===
        "Pending"
    ).length;

  const draftJobs =
    jobs.filter(
      (job) =>
        job.status ===
        "Draft"
    ).length;

  const totalApplications =
    jobs.reduce(
      (total, job) =>
        total +
        Number(
          job.applications ??
            job.applicationCount ??
            0
        ),
      0
    );

  // =========================================
  // HELPERS
  // =========================================

  const getJobId = (job) =>
    job._id || job.id;

  const getJobTitle = (job) =>
    job.jobTitle ||
    job.title ||
    "Untitled Job";

  const getCompany = (job) =>
    job.companyName ||
    job.company ||
    "Company not specified";

  const getLocation = (job) =>
    job.location ||
    "Location not specified";

  const getJobType = (job) =>
    job.jobType ||
    job.type ||
    "Not specified";

  const getIndustry = (job) =>
    job.industry ||
    job.category ||
    "Not specified";

  const getApplications = (
    job
  ) =>
    Number(
      job.applications ??
        job.applicationCount ??
        0
    );

  const getStatus = (job) =>
    job.status ||
    "Pending";

  const getPostedDate = (job) => {
    const date =
      job.createdAt ||
      job.updatedAt;

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
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (
    status
  ) => {
    if (status === "Approved") {
      return "active";
    }

    if (
      status === "Closed" ||
      status === "Rejected"
    ) {
      return "closed";
    }

    return "active";
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="employee-jobs-page">

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="employee-jobs-main">

        {/* HEADER */}

        <header className="employee-jobs-header">

          <div>

            <p className="employee-jobs-eyebrow">
              AGENT WORKSPACE
            </p>

            <h1>
              My Jobs
            </h1>

            <p>
              View and manage jobs assigned to you.
            </p>

          </div>

          <div className="employee-jobs-header-actions">

            <button
              type="button"
              className="employee-jobs-refresh"
              onClick={
                fetchJobs
              }
              disabled={loading}
              title="Refresh jobs"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "employee-jobs-refresh-spin"
                    : ""
                }
              />
            </button>

            <button
              type="button"
              className="employee-jobs-post-button"
              onClick={() =>
                navigate(
                  "/employee-dashboard/post-job"
                )
              }
            >
              <Plus size={17} />
              Post a Job
            </button>

          </div>

        </header>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="employee-jobs-error">

            <strong>
              Unable to load jobs
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={
                fetchJobs
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================================
            SUMMARY
        ========================================= */}

        <section className="employee-jobs-summary">

          <div className="employee-jobs-summary-card">

            <div className="employee-jobs-summary-icon">
              <BriefcaseBusiness
                size={19}
              />
            </div>

            <div>

              <strong>
                {loading
                  ? "..."
                  : totalJobs}
              </strong>

              <span>
                Total Jobs
              </span>

            </div>

          </div>

          <div className="employee-jobs-summary-card">

            <div className="employee-jobs-summary-icon">
              <CheckCircle2
                size={19}
              />
            </div>

            <div>

              <strong>
                {loading
                  ? "..."
                  : approvedJobs}
              </strong>

              <span>
                Approved Jobs
              </span>

            </div>

          </div>

          <div className="employee-jobs-summary-card">

            <div className="employee-jobs-summary-icon">
              <Clock3
                size={19}
              />
            </div>

            <div>

              <strong>
                {loading
                  ? "..."
                  : pendingJobs}
              </strong>

              <span>
                Pending Jobs
              </span>

            </div>

          </div>

          <div className="employee-jobs-summary-card">

            <div className="employee-jobs-summary-icon">
              <FileText
                size={19}
              />
            </div>

            <div>

              <strong>
                {loading
                  ? "..."
                  : draftJobs}
              </strong>

              <span>
                Draft Jobs
              </span>

            </div>

          </div>

          <div className="employee-jobs-summary-card">

            <div className="employee-jobs-summary-icon">
              <Users
                size={19}
              />
            </div>

            <div>

              <strong>
                {loading
                  ? "..."
                  : totalApplications}
              </strong>

              <span>
                Total Applications
              </span>

            </div>

          </div>

        </section>

        {/* =========================================
            FILTERS
        ========================================= */}

        <section className="employee-jobs-toolbar">

          <div className="employee-jobs-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search jobs, companies or locations..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Rejected">
              Rejected
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>

        </section>

        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (
          <section className="employee-jobs-list">

            <div className="employee-jobs-empty">

              <BriefcaseBusiness
                size={30}
              />

              <h3>
                Loading your jobs...
              </h3>

              <p>
                Please wait while we
                load your jobs from the server.
              </p>

            </div>

          </section>
        )}

        {/* =========================================
            EMPTY
        ========================================= */}

        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <section className="employee-jobs-list">

              <div className="employee-jobs-empty">

                <BriefcaseBusiness
                  size={30}
                />

                <h3>
                  {jobs.length === 0
                    ? "No jobs posted yet"
                    : "No jobs found"}
                </h3>

                <p>
                  {jobs.length === 0
                    ? "You have not posted any jobs yet."
                    : "No jobs match your current search or filter."}
                </p>

                {jobs.length === 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/employee-dashboard/post-job"
                      )
                    }
                  >
                    <Plus size={16} />
                    Post Your First Job
                  </button>
                )}

              </div>

            </section>
          )}

        {/* =========================================
            JOB LIST
        ========================================= */}

        {!loading &&
          filteredJobs.length > 0 && (
            <section className="employee-jobs-list">

              {filteredJobs.map(
                (job) => {

                  const jobId =
                    getJobId(job);

                  const status =
                    getStatus(job);

                  const applications =
                    getApplications(
                      job
                    );

                  return (
                    <article
                      className="employee-job-card"
                      key={
                        jobId
                      }
                    >

                      {/* TOP */}

                      <div className="employee-job-card-top">

                        <div className="employee-job-icon">
                          <BriefcaseBusiness
                            size={21}
                          />
                        </div>

                        <div className="employee-job-heading">

                          <div className="employee-job-title-row">

                            <h2>
                              {getJobTitle(
                                job
                              )}
                            </h2>

                            <span
                              className={`employee-job-status ${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>

                          </div>

                          <p>
                            {getCompany(
                              job
                            )}
                          </p>

                        </div>

                      </div>

                      {/* META */}

                      <div className="employee-job-meta">

                        <div>

                          <MapPin
                            size={15}
                          />

                          <span>
                            {getLocation(
                              job
                            )}
                          </span>

                        </div>

                        <div>

                          <Clock3
                            size={15}
                          />

                          <span>
                            {getJobType(
                              job
                            )}
                          </span>

                        </div>

                        <div>

                          <Users
                            size={15}
                          />

                          <span>
                            {applications}{" "}
                            Applications
                          </span>

                        </div>

                      </div>

                      {/* BOTTOM */}

                      <div className="employee-job-bottom">

                        <div className="employee-job-details">

                          <span>
                            Industry:{" "}
                            <strong>
                              {getIndustry(
                                job
                              )}
                            </strong>
                          </span>

                          <span>
                            Posted:{" "}
                            <strong>
                              {getPostedDate(
                                job
                              )}
                            </strong>
                          </span>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/employee-dashboard/jobs/${jobId}`
                            )
                          }
                        >
                          <Eye size={16} />
                          View Details
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </section>
          )}

      </main>

    </div>
  );
};

export default EmployeeJobs;
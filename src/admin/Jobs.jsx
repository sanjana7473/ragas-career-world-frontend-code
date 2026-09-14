import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import "./Jobs.css";

const API_URL = API_BASE_URL;

const JOBS_PER_PAGE = 10;

function Jobs() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingJobId, setUpdatingJobId] = useState(null);

  // Applicant modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState(null);

  // =====================================================
  // SAFE JSON FUNCTION
  // =====================================================

  const getJsonResponse = async (response) => {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Invalid API response:", text);

      throw new Error(
        "Backend API returned an invalid response."
      );
    }
  };

  // =====================================================
  // FETCH JOBS + APPLICATIONS
  // =====================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsResponse, applicationsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/jobs/admin/all`),
          fetch(`${API_URL}/api/applications`),
        ]);

      if (!jobsResponse.ok) {
        throw new Error("Unable to load jobs.");
      }

      if (!applicationsResponse.ok) {
        throw new Error("Unable to load applications.");
      }

      const jobsData = await getJsonResponse(
        jobsResponse
      );

      const applicationsData =
        await getJsonResponse(
          applicationsResponse
        );

      console.log("Admin Jobs:", jobsData);
      console.log(
        "Applications:",
        applicationsData
      );

      setJobs(jobsData.data || []);
      setApplications(
        applicationsData.data || []
      );
    } catch (err) {
      console.error("Jobs error:", err);

      setError(
        err.message ||
          "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================
  // NORMALIZE
  // =====================================================

  const normalize = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  };

  // =====================================================
  // SLUGIFY
  // =====================================================

  const slugify = (value) => {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[—–]/g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // =====================================================
  // DISPLAY STATUS
  // =====================================================

  const getDisplayStatus = (status) => {
    if (status === "Approved") {
      return "Published";
    }

    if (status === "Pending") {
      return "Pending";
    }

    if (status === "Rejected") {
      return "Rejected";
    }

    if (status === "Closed") {
      return "Closed";
    }

    return status || "Pending";
  };

  // =====================================================
  // INDUSTRIES
  // =====================================================

  const industries = useMemo(() => {
    const values = jobs
      .map((job) => job.category)
      .filter(Boolean);

    return [...new Set(values)].sort();
  }, [jobs]);

  // =====================================================
  // APPLICATION BELONGS TO JOB
  // =====================================================

  const applicationBelongsToJob = (
    application,
    job
  ) => {
    const applicationJobId = normalize(
      application.jobId
    );

    const applicationJobTitle = normalize(
      application.jobTitle
    );

    const mongoJobId = normalize(job._id);

    const adminJobTitle = normalize(
      job.jobTitle
    );

    const adminJobSlug = normalize(
      slugify(job.jobTitle)
    );

    // MongoDB ID
    if (
      applicationJobId &&
      mongoJobId &&
      applicationJobId === mongoJobId
    ) {
      return true;
    }

    // Exact title
    if (
      applicationJobTitle &&
      adminJobTitle &&
      applicationJobTitle === adminJobTitle
    ) {
      return true;
    }

    // jobId = title
    if (
      applicationJobId &&
      adminJobTitle &&
      applicationJobId === adminJobTitle
    ) {
      return true;
    }

    // jobId = slug
    if (
      applicationJobId &&
      adminJobSlug &&
      applicationJobId === adminJobSlug
    ) {
      return true;
    }

    return false;
  };

  // =====================================================
  // GET APPLICANTS
  // =====================================================

  const getApplicants = (job) => {
    return applications.filter(
      (application) =>
        applicationBelongsToJob(
          application,
          job
        )
    );
  };

  // =====================================================
  // APPLICANT COUNT
  // =====================================================

  const getApplicantCount = (job) => {
    return getApplicants(job).length;
  };

  // =====================================================
  // OPEN APPLICANTS
  // =====================================================

  const openApplicants = (job) => {
    setSelectedJob(job);
    setSelectedApplication(null);
    setShowApplicants(true);
  };

  // =====================================================
  // VIEW JOB
  // =====================================================

  const handleViewJob = (job) => {
    if (!job?._id) {
      alert("Job ID is not available.");
      return;
    }

    navigate(
      `/admin/jobs/${job._id}`
    );
  };

  // =====================================================
  // UPDATE JOB STATUS
  // =====================================================

  const updateJobStatus = async (
    jobId,
    newStatus
  ) => {
    if (!jobId) {
      alert("Job ID is not available.");
      return;
    }

    try {
      setUpdatingJobId(jobId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/jobs/${jobId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result =
        await getJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update job status."
        );
      }

      console.log(
        "Job status updated:",
        result.data
      );

      // Update table immediately
      setJobs((previousJobs) =>
        previousJobs.map((job) =>
          job._id === jobId
            ? {
                ...job,
                status: newStatus,
              }
            : job
        )
      );

      // Update selected job if modal is open
      setSelectedJob((previousJob) => {
        if (
          !previousJob ||
          previousJob._id !== jobId
        ) {
          return previousJob;
        }

        return {
          ...previousJob,
          status: newStatus,
        };
      });

    } catch (err) {
      console.error(
        "Update job status error:",
        err
      );

      alert(
        err.message ||
          "Unable to update job status."
      );
    } finally {
      setUpdatingJobId(null);
    }
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const approveJob = (job) => {
    if (!job?._id) {
      alert("Job ID is not available.");
      return;
    }

    updateJobStatus(
      job._id,
      "Approved"
    );
  };

  // =====================================================
  // REJECT
  // =====================================================

  const rejectJob = (job) => {
    if (!job?._id) {
      alert("Job ID is not available.");
      return;
    }

    updateJobStatus(
      job._id,
      "Rejected"
    );
  };

  // =====================================================
  // CLOSE JOB
  // =====================================================

  const closeJob = (job) => {
    if (!job?._id) {
      alert("Job ID is not available.");
      return;
    }

    updateJobStatus(
      job._id,
      "Closed"
    );
  };

  // =====================================================
  // REOPEN JOB
  // =====================================================

  const reopenJob = (job) => {
    if (!job?._id) {
      alert("Job ID is not available.");
      return;
    }

    updateJobStatus(
      job._id,
      "Pending"
    );
  };

  // =====================================================
  // CLOSE APPLICANT MODAL
  // =====================================================

  const closeApplicants = () => {
    setShowApplicants(false);
    setSelectedJob(null);
    setSelectedApplication(null);
  };

  // =====================================================
  // OPEN APPLICATION
  // =====================================================

  const openApplication = (
    application
  ) => {
    setSelectedApplication(
      application
    );
  };

  // =====================================================
  // BACK TO APPLICANTS
  // =====================================================

  const backToApplicants = () => {
    setSelectedApplication(null);
  };

  // =====================================================
  // EMAIL CANDIDATE
  // =====================================================

  const emailCandidate = (
    application
  ) => {
    if (!application?.email) {
      alert(
        "Candidate email is not available."
      );
      return;
    }

    const subject =
      encodeURIComponent(
        `Regarding your application - ${
          application.jobTitle ||
          "Job Application"
        }`
      );

    const body =
      encodeURIComponent(
        `Dear ${
          application.fullName ||
          "Candidate"
        },\n\n` +
          `We are contacting you regarding your job application.\n\n` +
          `Regards,\nRAGAS CAREER WORLD`
      );

    window.location.href =
      `mailto:${application.email}?subject=${subject}&body=${body}`;
  };

  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappCandidate = (
    application
  ) => {
    if (!application?.phone) {
      alert(
        "Candidate phone number is not available."
      );
      return;
    }

    let phone = String(
      application.phone
    ).replace(/\D/g, "");

    if (phone.length === 10) {
      phone = `91${phone}`;
    }

    const message =
      encodeURIComponent(
        `Hello ${
          application.fullName ||
          "Candidate"
        }, this is RAGAS CAREER WORLD regarding your job application.`
      );

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank"
    );
  };

  // =====================================================
  // CALL
  // =====================================================

  const callCandidate = (
    application
  ) => {
    if (!application?.phone) {
      alert(
        "Candidate phone number is not available."
      );
      return;
    }

    window.location.href =
      `tel:${application.phone}`;
  };

  // =====================================================
  // RESUME
  // =====================================================

  const handleResume = (
    application
  ) => {
    if (!application?.resumeFile) {
      alert(
        "Resume is not available."
      );
      return;
    }

    const resumeUrl =
      `${API_URL}/api/applications/resume/${encodeURIComponent(
        application.resumeFile
      )}`;

    window.open(
      resumeUrl,
      "_blank"
    );
  };

  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateApplicationStatus =
    async (
      applicationId,
      newStatus
    ) => {
      try {
        const response = await fetch(
          `${API_URL}/api/applications/${applicationId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

        const result =
          await getJsonResponse(
            response
          );

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update application status."
          );
        }

        setApplications(
          (previousApplications) =>
            previousApplications.map(
              (application) =>
                application._id ===
                applicationId
                  ? {
                      ...application,
                      status:
                        newStatus,
                    }
                  : application
            )
        );

        setSelectedApplication(
          (previous) => {
            if (!previous) {
              return previous;
            }

            if (
              previous._id !==
              applicationId
            ) {
              return previous;
            }

            return {
              ...previous,
              status:
                newStatus,
            };
          }
        );

      } catch (err) {
        console.error(
          "Application status update error:",
          err
        );

        alert(
          err.message ||
            "Unable to update application status."
        );
      }
    };

  // =====================================================
  // FILTER JOBS
  // =====================================================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue =
        normalize(search);

      const matchesSearch =
        !searchValue ||
        normalize(
          job.jobTitle
        ).includes(searchValue) ||
        normalize(
          job.companyName
        ).includes(searchValue) ||
        normalize(
          job.location
        ).includes(searchValue) ||
        normalize(
          job.category
        ).includes(searchValue) ||
        normalize(
          job._id
        ).includes(searchValue);

      const matchesIndustry =
        industryFilter === "All" ||
        job.category ===
          industryFilter;

      const displayStatus =
        getDisplayStatus(
          job.status
        );

      const matchesStatus =
        statusFilter === "All" ||
        displayStatus ===
          statusFilter;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesStatus
      );
    });
  }, [
    jobs,
    search,
    industryFilter,
    statusFilter,
  ]);

  // =====================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    industryFilter,
    statusFilter,
  ]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredJobs.length /
        JOBS_PER_PAGE
    )
  );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (safeCurrentPage - 1) *
    JOBS_PER_PAGE;

  const endIndex =
    startIndex +
    JOBS_PER_PAGE;

  const paginatedJobs =
    filteredJobs.slice(
      startIndex,
      endIndex
    );

  const showingStart =
    filteredJobs.length === 0
      ? 0
      : startIndex + 1;

  const showingEnd =
    Math.min(
      endIndex,
      filteredJobs.length
    );

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const pageNumbers = [];

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pageNumbers.push(page);
  }

  // =====================================================
  // JOB ID
  // =====================================================

  const getJobId = (
    job,
    index
  ) => {
    if (job?._id) {
      return `JOB-${job._id
        .slice(-4)
        .toUpperCase()}`;
    }

    return `JOB-${String(
      index + 1
    ).padStart(4, "0")}`;
  };

  // =====================================================
  // STATS
  // =====================================================

  const totalApplicants =
    applications.length;

  const publishedJobs =
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

  const rejectedJobs =
    jobs.filter(
      (job) =>
        job.status ===
        "Rejected"
    ).length;

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setSearch("");
    setIndustryFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="jobs-admin-page">
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          Loading jobs...
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="jobs-admin-page">

      {/* =================================================
          HEADING
      ================================================= */}

      <div className="jobs-admin-heading">

        <div>
          <p>
            JOB MANAGEMENT
          </p>

          <h2>
            Job Posts
          </h2>

          <span>
            Review, approve and manage
            job vacancies submitted by
            employers.
          </span>
        </div>

        <button
          className="add-job-btn"
          type="button"
          onClick={() =>
            navigate("/post-a-job")
          }
        >
          + Add Job
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            padding:
              "12px 16px",
            marginBottom:
              "20px",
            background:
              "#fff4f4",
            color:
              "#b42318",
            borderRadius:
              "8px",
          }}
        >
          {error}
        </div>
      )}


      {/* =================================================
          STATS
      ================================================= */}

      <div className="job-admin-stats">

        <div>
          <span>
            Total Jobs
          </span>

          <strong>
            {jobs.length}
          </strong>

          <small>
            All job postings
          </small>
        </div>


        <div>
          <span>
            Published
          </span>

          <strong>
            {publishedJobs}
          </strong>

          <small>
            Currently approved
          </small>
        </div>


        <div>
          <span>
            Pending Approval
          </span>

          <strong>
            {pendingJobs}
          </strong>

          <small>
            Requires review
          </small>
        </div>


        <div>
          <span>
            Rejected
          </span>

          <strong>
            {rejectedJobs}
          </strong>

          <small>
            Rejected job posts
          </small>
        </div>


        <div>
          <span>
            Total Applicants
          </span>

          <strong>
            {totalApplicants}
          </strong>

          <small>
            Applications received
          </small>
        </div>

      </div>


      {/* =================================================
          TABLE CARD
      ================================================= */}

      <section className="jobs-admin-card">

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="jobs-admin-toolbar">

          <div className="jobs-admin-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search job title, company or job ID..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <select
            value={
              industryFilter
            }
            onChange={(e) =>
              setIndustryFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Industries
            </option>

            {industries.map(
              (industry) => (
                <option
                  key={industry}
                  value={industry}
                >
                  {industry}
                </option>
              )
            )}

          </select>


          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Published">
              Published
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Rejected">
              Rejected
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>


          <button
            className="jobs-filter-btn"
            type="button"
            onClick={
              resetFilters
            }
          >
            Reset
          </button>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="jobs-table-wrapper">

          <table className="jobs-admin-table">

            <thead>

              <tr>
                <th>
                  Job
                </th>

                <th>
                  Employer
                </th>

                <th>
                  Location
                </th>

                <th>
                  Industry
                </th>

                <th>
                  Applicants
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>
              </tr>

            </thead>


            <tbody>

              {paginatedJobs.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "40px",
                    }}
                  >
                    No jobs found.
                  </td>

                </tr>

              ) : (

                paginatedJobs.map(
                  (job, index) => {

                    const realIndex =
                      startIndex +
                      index;

                    const jobId =
                      getJobId(
                        job,
                        realIndex
                      );

                    const displayStatus =
                      getDisplayStatus(
                        job.status
                      );

                    const applicantCount =
                      getApplicantCount(
                        job
                      );

                    const isUpdating =
                      updatingJobId ===
                      job._id;

                    return (
                      <tr
                        key={
                          job._id ||
                          jobId
                        }
                      >

                        {/* JOB */}

                        <td>

                          <div className="job-title-cell">

                            <strong>
                              {job.jobTitle ||
                                "Job Position"}
                            </strong>

                            <small>
                              {jobId}
                            </small>

                          </div>

                        </td>


                        {/* EMPLOYER */}

                        <td>
                          {job.companyName ||
                            "—"}
                        </td>


                        {/* LOCATION */}

                        <td>
                          {job.location ||
                            "—"}
                        </td>


                        {/* INDUSTRY */}

                        <td>
                          {job.category ||
                            "—"}
                        </td>


                        {/* APPLICANTS */}

                        <td>

                          <button
                            type="button"
                            className="applicant-count applicant-count-btn"
                            onClick={() =>
                              openApplicants(
                                job
                              )
                            }
                          >
                            {
                              applicantCount
                            }
                          </button>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`job-admin-status ${displayStatus
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {
                              displayStatus
                            }
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="job-action-buttons">

                            {/* VIEW */}

                            <button
                              className="job-view-btn"
                              type="button"
                              onClick={() =>
                                handleViewJob(
                                  job
                                )
                              }
                            >
                              View
                            </button>


                            {/* PENDING */}

                            {job.status ===
                              "Pending" && (
                              <>
                                <button
                                  className="job-approve-btn"
                                  type="button"
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    approveJob(
                                      job
                                    )
                                  }
                                >
                                  {isUpdating
                                    ? "..."
                                    : "Approve"}
                                </button>

                                <button
                                  className="job-reject-btn"
                                  type="button"
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    rejectJob(
                                      job
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}


                            {/* APPROVED */}

                            {job.status ===
                              "Approved" && (
                              <button
                                className="job-close-btn"
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  closeJob(
                                    job
                                  )
                                }
                              >
                                {isUpdating
                                  ? "..."
                                  : "Close"}
                              </button>
                            )}


                            {/* REJECTED */}

                            {job.status ===
                              "Rejected" && (
                              <button
                                className="job-reopen-btn"
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  reopenJob(
                                    job
                                  )
                                }
                              >
                                {isUpdating
                                  ? "..."
                                  : "Reopen"}
                              </button>
                            )}


                            {/* CLOSED */}

                            {job.status ===
                              "Closed" && (
                              <button
                                className="job-reopen-btn"
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  approveJob(
                                    job
                                  )
                                }
                              >
                                {isUpdating
                                  ? "..."
                                  : "Publish"}
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="jobs-pagination">

          <span>
            Showing{" "}
            {showingStart}-
            {showingEnd} of{" "}
            {filteredJobs.length}{" "}
            jobs
          </span>


          <div>

            <button
              type="button"
              disabled={
                safeCurrentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
            >
              ‹
            </button>


            {pageNumbers.map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    safeCurrentPage ===
                    page
                      ? "jobs-page-active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                >
                  {page}
                </button>
              )
            )}


            <button
              type="button"
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
            >
              ›
            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          APPLICANTS MODAL
      ================================================= */}

      {showApplicants &&
        selectedJob && (

          <div
            className="applicants-modal-overlay"
            onClick={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeApplicants();
              }
            }}
          >

            <div className="applicants-modal">

              {/* MODAL HEADER */}

              <div className="applicants-modal-header">

                <div>

                  <span>
                    JOB APPLICANTS
                  </span>

                  <h2>
                    {
                      selectedJob.jobTitle
                    }
                  </h2>

                  <p>
                    {
                      getApplicantCount(
                        selectedJob
                      )
                    }{" "}
                    applicant
                    {getApplicantCount(
                      selectedJob
                    ) !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>


                <button
                  className="modal-close-btn"
                  type="button"
                  onClick={
                    closeApplicants
                  }
                >
                  ×
                </button>

              </div>


              {/* =================================================
                  APPLICATION DETAIL
              ================================================= */}

              {selectedApplication ? (

                <div className="application-detail">

                  <button
                    className="back-to-applicants"
                    type="button"
                    onClick={
                      backToApplicants
                    }
                  >
                    ← Back to Applicants
                  </button>


                  {/* CANDIDATE HEADER */}

                  <div className="candidate-detail-header">

                    <div className="candidate-avatar large">
                      {(
                        selectedApplication.fullName ||
                        "C"
                      )
                        .charAt(
                          0
                        )
                        .toUpperCase()}
                    </div>

                    <div>

                      <h2>
                        {
                          selectedApplication.fullName ||
                          "Candidate"
                        }
                      </h2>

                      <p>
                        {
                          selectedApplication.jobTitle ||
                          selectedJob.jobTitle
                        }
                      </p>

                    </div>

                  </div>


                  {/* CONTACT BUTTONS */}

                  <div className="candidate-contact-buttons">

                    <button
                      type="button"
                      onClick={() =>
                        emailCandidate(
                          selectedApplication
                        )
                      }
                    >
                      Email
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        whatsappCandidate(
                          selectedApplication
                        )
                      }
                    >
                      WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        callCandidate(
                          selectedApplication
                        )
                      }
                    >
                      Call
                    </button>

                  </div>


                  {/* PERSONAL */}

                  <div className="application-detail-section">

                    <h3>
                      Personal
                      Information
                    </h3>

                    <div className="detail-grid">

                      <div>
                        <span>
                          Full Name
                        </span>

                        <strong>
                          {
                            selectedApplication.fullName ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Email
                        </span>

                        <strong>
                          {
                            selectedApplication.email ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Phone
                        </span>

                        <strong>
                          {
                            selectedApplication.phone ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Date of Birth
                        </span>

                        <strong>
                          {
                            selectedApplication.dateOfBirth ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Current Location
                        </span>

                        <strong>
                          {
                            selectedApplication.currentLocation ||
                            "—"
                          }
                        </strong>
                      </div>

                    </div>

                  </div>


                  {/* PROFESSIONAL */}

                  <div className="application-detail-section">

                    <h3>
                      Professional
                      Information
                    </h3>

                    <div className="detail-grid">

                      <div>
                        <span>
                          Current Job
                          Title
                        </span>

                        <strong>
                          {
                            selectedApplication.currentJobTitle ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Total
                          Experience
                        </span>

                        <strong>
                          {
                            selectedApplication.totalExperience ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Highest
                          Qualification
                        </span>

                        <strong>
                          {
                            selectedApplication.highestQualification ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Current
                          Company
                        </span>

                        <strong>
                          {
                            selectedApplication.currentCompany ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div className="full-detail">

                        <span>
                          Key Skills
                        </span>

                        <strong>
                          {
                            selectedApplication.keySkills ||
                            "—"
                          }
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* PREFERENCES */}

                  <div className="application-detail-section">

                    <h3>
                      Job
                      Preferences
                    </h3>

                    <div className="detail-grid">

                      <div>
                        <span>
                          Preferred
                          Location
                        </span>

                        <strong>
                          {
                            selectedApplication.preferredLocation ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Preferred
                          Country
                        </span>

                        <strong>
                          {
                            selectedApplication.preferredCountry ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Expected
                          Salary
                        </span>

                        <strong>
                          {
                            selectedApplication.expectedSalary ||
                            "—"
                          }
                        </strong>
                      </div>


                      <div>
                        <span>
                          Notice
                          Period
                        </span>

                        <strong>
                          {
                            selectedApplication.noticePeriod ||
                            "—"
                          }
                        </strong>
                      </div>

                    </div>

                  </div>


                  {/* RESUME */}

                  <div className="application-detail-section">

                    <h3>
                      Resume
                    </h3>

                    <div className="resume-admin-box">

                      <div>

                        <strong>
                          {
                            selectedApplication.resumeFile ||
                            "No resume uploaded"
                          }
                        </strong>

                        <span>
                          Candidate
                          resume
                        </span>

                      </div>


                      <button
                        type="button"
                        disabled={
                          !selectedApplication.resumeFile
                        }
                        onClick={() =>
                          handleResume(
                            selectedApplication
                          )
                        }
                      >
                        View Resume
                      </button>

                    </div>

                  </div>


                  {/* COVER LETTER */}

                  <div className="application-detail-section">

                    <h3>
                      Cover Letter
                    </h3>

                    <div className="cover-letter-admin">

                      {
                        selectedApplication.coverLetter ||
                        "No cover letter provided."
                      }

                    </div>

                  </div>


                  {/* APPLICATION STATUS */}

                  <div className="application-detail-section">

                    <h3>
                      Application
                      Status
                    </h3>

                    <select
                      value={
                        selectedApplication.status ||
                        "New"
                      }
                      onChange={(e) =>
                        updateApplicationStatus(
                          selectedApplication._id,
                          e.target.value
                        )
                      }
                      style={{
                        padding:
                          "10px 14px",
                        border:
                          "1px solid #dce3e8",
                        borderRadius:
                          "7px",
                        background:
                          "#fff",
                        color:
                          "#173752",
                        fontWeight:
                          "600",
                        cursor:
                          "pointer",
                      }}
                    >

                      <option value="New">
                        New
                      </option>

                      <option value="Under Review">
                        Under Review
                      </option>

                      <option value="Shortlisted">
                        Shortlisted
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                      <option value="Hired">
                        Hired
                      </option>

                    </select>

                  </div>

                </div>

              ) : (

                /* =================================================
                    APPLICANT LIST
                ================================================= */

                <div className="applicants-list">

                  {getApplicants(
                    selectedJob
                  ).length === 0 ? (

                    <div className="no-applicants">

                      <div>
                        0
                      </div>

                      <h3>
                        No applicants yet
                      </h3>

                      <p>
                        No applications
                        have been
                        received for
                        this job.
                      </p>

                    </div>

                  ) : (

                    getApplicants(
                      selectedJob
                    ).map(
                      (
                        application
                      ) => (

                        <div
                          className="applicant-card"
                          key={
                            application._id
                          }
                        >

                          <div className="applicant-main">

                            <div className="candidate-avatar">

                              {(
                                application.fullName ||
                                "C"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}

                            </div>


                            <div>

                              <h3>
                                {
                                  application.fullName ||
                                  "Candidate"
                                }
                              </h3>

                              <p>
                                {
                                  application.currentJobTitle ||
                                  "Job Applicant"
                                }
                              </p>

                              <small>
                                Applied
                                for:{" "}
                                {
                                  selectedJob.jobTitle
                                }
                              </small>

                            </div>

                          </div>


                          {/* CONTACT */}

                          <div className="candidate-contact">

                            <span>
                              ✉{" "}
                              {
                                application.email ||
                                "No email"
                              }
                            </span>

                            <span>
                              ☎{" "}
                              {
                                application.phone ||
                                "No phone"
                              }
                            </span>

                            <span>
                              Status:{" "}
                              {
                                application.status ||
                                "New"
                              }
                            </span>

                          </div>


                          {/* ACTIONS */}

                          <div className="applicant-actions">

                            <button
                              className="candidate-action email"
                              type="button"
                              onClick={() =>
                                emailCandidate(
                                  application
                                )
                              }
                            >
                              Email
                            </button>


                            <button
                              className="candidate-action whatsapp"
                              type="button"
                              onClick={() =>
                                whatsappCandidate(
                                  application
                                )
                              }
                            >
                              WhatsApp
                            </button>


                            <button
                              className="candidate-action call"
                              type="button"
                              onClick={() =>
                                callCandidate(
                                  application
                                )
                              }
                            >
                              Call
                            </button>


                            <button
                              className="candidate-action view"
                              type="button"
                              onClick={() =>
                                openApplication(
                                  application
                                )
                              }
                            >
                              View Application
                            </button>

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

              )}

            </div>

          </div>

        )}

    </div>
  );
}

export default Jobs;
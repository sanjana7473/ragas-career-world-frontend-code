import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  FileText,
  ArrowLeft,
  MapPin,
  Clock3,
  Building2,
  CalendarDays,
  UsersRound,
  CheckCircle2,
  Eye,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./EmployeeJobDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const EmployeeJobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================================
  // STATE
  // =========================================

  const [job, setJob] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================
  // EMPLOYEE DATA
  // =========================================

  const employee = useMemo(() => {
    try {
      const savedEmployee =
        localStorage.getItem(
          "ragasEmployee"
        );

      return savedEmployee
        ? JSON.parse(savedEmployee)
        : null;
    } catch {
      return null;
    }
  }, []);

  const employeeName =
    employee?.name || "Employee";

  // =========================================
  // FETCH JOB DETAILS
  // =========================================

  const fetchJob = async () => {
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

      if (!id) {
        throw new Error(
          "Job ID is missing."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employee/jobs/${id}`,
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
            "Unable to load job details."
        );
      }

      const receivedJob =
        data.data ||
        data.job ||
        data;

      if (!receivedJob) {
        throw new Error(
          "Job details were not found."
        );
      }

      setJob(receivedJob);

      console.log(
        "Employee job details:",
        receivedJob
      );
    } catch (err) {
      console.error(
        "Employee job details error:",
        err
      );

      setJob(null);

      setError(
        err.message ||
          "Unable to load job details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD JOB
  // =========================================

  useEffect(() => {
    fetchJob();
  }, [id]);

  // =========================================
  // HELPERS
  // =========================================

  const getJobTitle = () =>
    job?.jobTitle ||
    job?.title ||
    "Untitled Job";

  const getCompany = () =>
    job?.companyName ||
    job?.company ||
    "Company not specified";

  const getLocation = () =>
    job?.location ||
    "Location not specified";

  const getJobType = () =>
    job?.jobType ||
    job?.type ||
    "Not specified";

  const getWorkMode = () =>
    job?.workMode ||
    "Not specified";

  const getIndustry = () =>
    job?.industry ||
    job?.category ||
    "Not specified";

  const getExperience = () =>
    job?.experience ||
    "Not specified";

  const getSalary = () => {
    if (job?.salary) {
      return job.salary;
    }

    const min = job?.salaryMin;
    const max = job?.salaryMax;

    if (min && max) {
      return `${min} - ${max}`;
    }

    if (min) {
      return String(min);
    }

    if (max) {
      return String(max);
    }

    return "Not specified";
  };

  const getOpenings = () =>
    job?.openings ??
    "Not specified";

  const getStatus = () =>
    job?.status ||
    "Pending";

  const getPostedDate = () => {
    const date =
      job?.createdAt ||
      job?.updatedAt;

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

  const getDeadline = () => {
    if (!job?.deadline) {
      return "Not specified";
    }

    const parsedDate =
      new Date(job.deadline);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not specified";
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

  const convertToList = (
    value
  ) => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);
    }

    return String(value)
      .split(/\r?\n/)
      .map((item) =>
        item
          .replace(/^[-•*]\s*/, "")
          .trim()
      )
      .filter(Boolean);
  };

  const getResponsibilities =
    () =>
      convertToList(
        job?.responsibilities
      );

  const getRequirements = () =>
    convertToList(
      job?.requirements
    );

  const getSkills = () =>
    convertToList(
      job?.skills
    );

  const getJobStatusClass =
    (status) => {
      switch (status) {
        case "Approved":
          return "active";

        case "Closed":
        case "Rejected":
          return "closed";

        case "Pending":
        case "Draft":
        default:
          return "active";
      }
    };

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <main className="employee-job-details-main">

        <div className="employee-job-details-empty-state">

          <BriefcaseBusiness
            size={32}
          />

          <h2>
            Loading job details...
          </h2>

          <p>
            Please wait while the
            job information is loaded.
          </p>

        </div>

      </main>
    );
  }

  // =========================================
  // ERROR / NOT FOUND
  // =========================================

  if (!job) {
    return (
      <main className="employee-job-details-main">

        <div className="employee-job-details-empty-state">

          <BriefcaseBusiness
            size={32}
          />

          <h2>
            Unable to load job
          </h2>

          <p>
            {error ||
              "This job could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/employee-dashboard/jobs"
              )
            }
          >
            <ArrowLeft
              size={16}
            />

            Back to My Jobs
          </button>

        </div>

      </main>
    );
  }

  // =========================================
  // PREPARE DATA
  // =========================================

  const status =
    getStatus();

  const responsibilities =
    getResponsibilities();

  const requirements =
    getRequirements();

  const skills =
    getSkills();

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <main className="employee-job-details-main">

      {/* ===================================
          HEADER
      ==================================== */}

      <header className="employee-job-details-header">

        <div>

          <button
            type="button"
            className="employee-job-details-back"
            onClick={() =>
              navigate(
                "/employee-dashboard/jobs"
              )
            }
          >
            <ArrowLeft
              size={15}
            />

            Back to My Jobs
          </button>

          <p className="employee-job-details-eyebrow">
            EMPLOYEE WORKSPACE
          </p>

          <div className="employee-job-details-title-row">

            <div className="employee-job-details-title-icon">
              <BriefcaseBusiness
                size={23}
              />
            </div>

            <div>

              <h1>
                {getJobTitle()}
              </h1>

              <p>
                {getCompany()}
              </p>

            </div>

          </div>

        </div>

        <span
          className={`employee-job-details-status ${getJobStatusClass(
            status
          )}`}
        >

          <CheckCircle2
            size={15}
          />

          {status}

        </span>

      </header>

      {/* ===================================
          JOB META
      ==================================== */}

      <section className="employee-job-details-meta">

        <div>

          <MapPin
            size={17}
          />

          <div>

            <span>
              Location
            </span>

            <strong>
              {getLocation()}
            </strong>

          </div>

        </div>

        <div>

          <Clock3
            size={17}
          />

          <div>

            <span>
              Job Type
            </span>

            <strong>
              {getJobType()}
            </strong>

          </div>

        </div>

        <div>

          <Building2
            size={17}
          />

          <div>

            <span>
              Industry
            </span>

            <strong>
              {getIndustry()}
            </strong>

          </div>

        </div>

        <div>

          <UsersRound
            size={17}
          />

          <div>

            <span>
              Work Mode
            </span>

            <strong>
              {getWorkMode()}
            </strong>

          </div>

        </div>

      </section>

      {/* ===================================
          CONTENT GRID
      ==================================== */}

      <div className="employee-job-details-grid">

        {/* =================================
            LEFT
        ================================== */}

        <div className="employee-job-details-left">

          {/* OVERVIEW */}

          <section className="employee-job-details-card">

            <div className="employee-job-details-card-heading">

              <div className="employee-job-details-card-icon">
                <FileText
                  size={18}
                />
              </div>

              <div>

                <h2>
                  Job Overview
                </h2>

                <p>
                  Details about this
                  assigned position.
                </p>

              </div>

            </div>

            <p className="employee-job-description">

              {job.description ||
                "No job description has been provided."}

            </p>

            <div className="employee-job-detail-info-grid">

              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {getExperience()}
                </strong>

              </div>

              <div>

                <span>
                  Salary
                </span>

                <strong>
                  {getSalary()}
                </strong>

              </div>

              <div>

                <span>
                  Posted Date
                </span>

                <strong>
                  {getPostedDate()}
                </strong>

              </div>

              <div>

                <span>
                  Application Deadline
                </span>

                <strong>
                  {getDeadline()}
                </strong>

              </div>

            </div>

          </section>

          {/* RESPONSIBILITIES */}

          <section className="employee-job-details-card">

            <div className="employee-job-details-card-heading">

              <div className="employee-job-details-card-icon">
                <CheckCircle2
                  size={18}
                />
              </div>

              <div>

                <h2>
                  Key Responsibilities
                </h2>

                <p>
                  Main responsibilities
                  for this role.
                </p>

              </div>

            </div>

            {responsibilities.length >
            0 ? (
              <ul className="employee-job-details-list">

                {responsibilities.map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      <CheckCircle2
                        size={15}
                      />

                      <span>
                        {item}
                      </span>
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p className="employee-job-description">
                No responsibilities
                have been provided.
              </p>
            )}

          </section>

          {/* REQUIREMENTS */}

          <section className="employee-job-details-card">

            <div className="employee-job-details-card-heading">

              <div className="employee-job-details-card-icon">
                <BriefcaseBusiness
                  size={18}
                />
              </div>

              <div>

                <h2>
                  Requirements
                </h2>

                <p>
                  Expected skills and
                  qualifications.
                </p>

              </div>

            </div>

            {requirements.length >
            0 ? (
              <ul className="employee-job-details-list">

                {requirements.map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      <CheckCircle2
                        size={15}
                      />

                      <span>
                        {item}
                      </span>
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p className="employee-job-description">
                No requirements
                have been provided.
              </p>
            )}

          </section>

          {/* SKILLS */}

          {skills.length > 0 && (
            <section className="employee-job-details-card">

              <div className="employee-job-details-card-heading">

                <div className="employee-job-details-card-icon">
                  <BriefcaseBusiness
                    size={18}
                  />
                </div>

                <div>

                  <h2>
                    Required Skills
                  </h2>

                  <p>
                    Skills specified
                    for this position.
                  </p>

                </div>

              </div>

              <ul className="employee-job-details-list">

                {skills.map(
                  (
                    skill,
                    index
                  ) => (
                    <li
                      key={index}
                    >
                      <CheckCircle2
                        size={15}
                      />

                      <span>
                        {skill}
                      </span>

                    </li>
                  )
                )}

              </ul>

            </section>
          )}

        </div>

        {/* =================================
            RIGHT
        ================================== */}

        <aside className="employee-job-details-right">

          {/* JOB SUMMARY */}

          <section className="employee-job-details-side-card">

            <div className="employee-job-details-side-heading">

              <BriefcaseBusiness
                size={18}
              />

              <h3>
                Job Summary
              </h3>

            </div>

            <div className="employee-job-details-side-info">

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
                  Work Mode
                </span>

                <strong>
                  {getWorkMode()}
                </strong>

              </div>

              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {getExperience()}
                </strong>

              </div>

              <div>

                <span>
                  Openings
                </span>

                <strong>
                  {getOpenings()}
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

          {/* JOB INFORMATION */}

          <section className="employee-job-details-side-card">

            <div className="employee-job-details-side-heading">

              <CalendarDays
                size={18}
              />

              <h3>
                Job Information
              </h3>

            </div>

            <div className="employee-job-details-side-info">

              <div>

                <span>
                  Job ID
                </span>

                <strong>
                  {job._id ||
                    id}
                </strong>

              </div>

              <div>

                <span>
                  Posted
                </span>

                <strong>
                  {getPostedDate()}
                </strong>

              </div>

              <div>

                <span>
                  Deadline
                </span>

                <strong>
                  {getDeadline()}
                </strong>

              </div>

              <div>

                <span>
                  Assigned To
                </span>

                <strong>
                  {employeeName}
                </strong>

              </div>

              <div>

                <span>
                  Status
                </span>

                <strong>
                  {status}
                </strong>

              </div>

            </div>

          </section>

          {/* APPLICATIONS */}

          <section className="employee-job-details-side-card">

            <div className="employee-job-details-side-heading">

              <UsersRound
                size={18}
              />

              <h3>
                Applications
              </h3>

            </div>

            <p className="employee-job-description">
              Applications will appear
              here once the employee
              application management
              backend is connected.
            </p>

            <button
              type="button"
              className="employee-job-details-applications-btn"
              onClick={() =>
                navigate(
                  "/employee-dashboard/applications"
                )
              }
            >
              <Eye size={16} />

              View Applications

            </button>

          </section>

        </aside>

      </div>

    </main>
  );
};

export default EmployeeJobDetails;
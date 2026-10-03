import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Users,
  UserCircle,
  Search,
  RefreshCw,
  ChevronRight,
  Loader2,
  AlertCircle,
  Building2,
  MapPin,
} from "lucide-react";

import "./EmployeeApplications.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmployeeApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* =====================================================
     FETCH APPLICATIONS
  ===================================================== */

  const fetchApplications = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem(
        "ragasEmployeeToken"
      );

      if (!token) {
        setError(
          "Employee authentication required."
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/employee/applications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
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
          `Server returned an unexpected response (${response.status}).`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch applications."
        );
      }

      setApplications(
        Array.isArray(data.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error(
        "Employee applications fetch error:",
        err
      );

      setError(
        err.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =====================================================
     LOAD APPLICATIONS
  ===================================================== */

  useEffect(() => {
    fetchApplications();
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  // Company name can come from different backend fields.
  const getCompanyName = (application) => {
    return (
      application?.companyName ||
      application?.company ||
      application?.employerName ||
      application?.employer?.companyName ||
      application?.employer?.name ||
      application?.job?.companyName ||
      application?.job?.company ||
      "Company not specified"
    );
  };

  const getJobTitle = (application) => {
    return (
      application?.jobTitle ||
      application?.job?.jobTitle ||
      application?.job?.title ||
      "N/A"
    );
  };

  const getLocation = (application) => {
    return (
      application?.currentLocation ||
      application?.location ||
      application?.job?.location ||
      "N/A"
    );
  };

  /* =====================================================
     SEARCH + STATUS FILTER
  ===================================================== */

  const filteredApplications = useMemo(() => {
    return applications.filter(
      (application) => {
        const search =
          searchTerm
            .toLowerCase()
            .trim();

        const companyName =
          getCompanyName(application);

        const jobTitle =
          getJobTitle(application);

        const matchesSearch =
          !search ||
          application.fullName
            ?.toLowerCase()
            .includes(search) ||
          application.email
            ?.toLowerCase()
            .includes(search) ||
          jobTitle
            ?.toLowerCase()
            .includes(search) ||
          companyName
            ?.toLowerCase()
            .includes(search) ||
          application.keySkills
            ?.toLowerCase()
            .includes(search) ||
          application.currentCompany
            ?.toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter === "All" ||
          application.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    applications,
    searchTerm,
    statusFilter,
  ]);

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Under Review":
        return "status-review";

      case "Shortlisted":
        return "status-shortlisted";

      case "Interview":
        return "status-interview";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "";
    }
  };

  /* =====================================================
     SUMMARY
  ===================================================== */

  const totalApplications =
    applications.length;

  const shortlistedCount =
    applications.filter(
      (item) =>
        item.status === "Shortlisted"
    ).length;

  const interviewCount =
    applications.filter(
      (item) =>
        item.status === "Interview"
    ).length;

  const selectedCount =
    applications.filter(
      (item) =>
        item.status === "Selected"
    ).length;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="employee-applications-page">

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="employee-applications-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="employee-jobs-header">

          <div>
            <h1>
              Applications
            </h1>

            <p>
              Manage applications submitted
              for your jobs.
            </p>
          </div>

          <button
            type="button"
            className="employee-refresh-btn"
            onClick={() =>
              fetchApplications(true)
            }
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2
                size={17}
                className="spin"
              />
            ) : (
              <RefreshCw
                size={17}
              />
            )}

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="employee-jobs-summary">

          {/* TOTAL */}

          <div className="employee-summary-card">

            <div className="employee-summary-icon">
              <FileText size={20} />
            </div>

            <div>
              <span>
                Total Applications
              </span>

              <strong>
                {totalApplications}
              </strong>
            </div>

          </div>

          {/* SHORTLISTED */}

          <div className="employee-summary-card">

            <div className="employee-summary-icon">
              <Users size={20} />
            </div>

            <div>
              <span>
                Shortlisted
              </span>

              <strong>
                {shortlistedCount}
              </strong>
            </div>

          </div>

          {/* INTERVIEW */}

          <div className="employee-summary-card">

            <div className="employee-summary-icon">
              <Briefcase size={20} />
            </div>

            <div>
              <span>
                Interview
              </span>

              <strong>
                {interviewCount}
              </strong>
            </div>

          </div>

          {/* SELECTED */}

          <div className="employee-summary-card">

            <div className="employee-summary-icon">
              <UserCircle size={20} />
            </div>

            <div>
              <span>
                Selected
              </span>

              <strong>
                {selectedCount}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="employee-jobs-toolbar">

          <div className="employee-search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search candidate, company, job or skill..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
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

            <option value="Applied">
              Applied
            </option>

            <option value="Under Review">
              Under Review
            </option>

            <option value="Shortlisted">
              Shortlisted
            </option>

            <option value="Interview">
              Interview
            </option>

            <option value="Selected">
              Selected
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="employee-applications-state">

            <Loader2
              size={30}
              className="spin"
            />

            <p>
              Loading applications...
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="employee-applications-state error-state">

            <AlertCircle size={30} />

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchApplications()
              }
              className="employee-retry-btn"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredApplications.length ===
            0 && (
            <div className="employee-applications-state">

              <FileText size={42} />

              <h3>
                {applications.length ===
                0
                  ? "No applications yet"
                  : "No matching applications"}
              </h3>

              <p>
                {applications.length ===
                0
                  ? "Applications submitted for your jobs will appear here."
                  : "Try changing your search or status filter."}
              </p>

            </div>
          )}

        {/* =================================================
            APPLICATION LIST
        ================================================= */}

        {!loading &&
          !error &&
          filteredApplications.length >
            0 && (
            <div className="employee-jobs-list">

              {filteredApplications.map(
                (application) => {

                  const companyName =
                    getCompanyName(
                      application
                    );

                  const jobTitle =
                    getJobTitle(
                      application
                    );

                  const location =
                    getLocation(
                      application
                    );

                  return (
                    <div
                      className="employee-job-card"
                      key={
                        application._id
                      }
                    >

                      {/* =================================================
                          TOP
                      ================================================= */}

                      <div className="employee-job-card-top">

                        <div className="employee-application-candidate">

                          <h3>
                            {application.fullName ||
                              "Candidate"}
                          </h3>

                          <p className="employee-application-email">
                            {application.email ||
                              "Email not provided"}
                          </p>

                        </div>

                        <span
                          className={`employee-status-badge ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status ||
                            "Applied"}
                        </span>

                      </div>

                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div className="employee-job-card-details">

                        {/* JOB */}

                        <div className="employee-application-detail-item">

                          <span>
                            <Briefcase
                              size={14}
                            />
                            Job
                          </span>

                          <strong>
                            {jobTitle}
                          </strong>

                        </div>

                        {/* COMPANY */}

                        <div className="employee-application-detail-item">

                          <span>
                            <Building2
                              size={14}
                            />
                            Company
                          </span>

                          <strong>
                            {companyName}
                          </strong>

                        </div>

                        {/* EXPERIENCE */}

                        <div className="employee-application-detail-item">

                          <span>
                            Experience
                          </span>

                          <strong>
                            {application.totalExperience ||
                              "N/A"}
                          </strong>

                        </div>

                        {/* QUALIFICATION */}

                        <div className="employee-application-detail-item">

                          <span>
                            Qualification
                          </span>

                          <strong>
                            {application.highestQualification ||
                              "N/A"}
                          </strong>

                        </div>

                        {/* LOCATION */}

                        <div className="employee-application-detail-item">

                          <span>
                            <MapPin
                              size={14}
                            />
                            Location
                          </span>

                          <strong>
                            {location}
                          </strong>

                        </div>

                      </div>

                      {/* =================================================
                          BOTTOM
                      ================================================= */}

                      <div className="employee-application-bottom">

                        <div className="employee-application-skills">

                          <span>
                            Skills:
                          </span>

                          <strong>
                            {application.keySkills ||
                              "Not provided"}
                          </strong>

                        </div>

                        <div className="employee-application-actions">

                          <small>
                            Applied{" "}
                            {application.createdAt
                              ? new Date(
                                  application.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : ""}
                          </small>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/employee-dashboard/applications/${application._id}`
                              )
                            }
                          >
                            View Details

                            <ChevronRight
                              size={17}
                            />
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </main>

    </div>
  );
};

export default EmployeeApplications;
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  Building2,
  RefreshCw,
  Eye,
  Loader2,
} from "lucide-react";

import "./Applications.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/applications`;

const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

function Applications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH APPLICATIONS
  ===================================================== */

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("ragasAdminToken") || "";

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Unable to fetch applications."
        );
      }

      setApplications(data.data || []);
    } catch (err) {
      console.error(
        "Applications fetch error:",
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
    fetchApplications();
  }, []);

  /* =====================================================
     COMPANY NAME
  ===================================================== */

  const getCompanyName = (application) => {
    return (
      application?.companyName ||
      application?.company ||
      application?.employerName ||
      application?.jobCompanyName ||
      application?.job?.companyName ||
      application?.job?.company ||
      application?.job?.employerName ||
      "RAGAS CAREER WORLD"
    );
  };

  /* =====================================================
     FILTER APPLICATIONS
  ===================================================== */

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchText =
        search.toLowerCase().trim();

      const companyName =
        getCompanyName(application);

      const matchesSearch =
        !searchText ||
        application.fullName
          ?.toLowerCase()
          .includes(searchText) ||
        application.email
          ?.toLowerCase()
          .includes(searchText) ||
        application.phone
          ?.toLowerCase()
          .includes(searchText) ||
        application.jobTitle
          ?.toLowerCase()
          .includes(searchText) ||
        application.jobId
          ?.toLowerCase()
          .includes(searchText) ||
        companyName
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All Status" ||
        application.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    applications,
    search,
    statusFilter,
  ]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalApplications =
    applications.length;

  const newApplications =
    applications.filter(
      (application) =>
        application.status === "Applied"
    ).length;

  const shortlistedApplications =
    applications.filter(
      (application) =>
        application.status === "Shortlisted"
    ).length;

  const selectedApplications =
    applications.filter(
      (application) =>
        application.status === "Selected"
    ).length;

  /* =====================================================
     DATE
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
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="applications-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="applications-header">

        <div>
          <p className="applications-eyebrow">
            CANDIDATE MANAGEMENT
          </p>

          <h1>
            Applications
          </h1>

          <p>
            Manage and review all job
            applications submitted by
            candidates.
          </p>
        </div>

        <button
          type="button"
          className="applications-refresh"
          onClick={fetchApplications}
          disabled={loading}
        >
          {loading ? (
            <Loader2
              size={15}
              className="applications-spin"
            />
          ) : (
            <RefreshCw size={15} />
          )}

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="applications-stats">

        <div className="application-stat-card">
          <span>
            Total Applications
          </span>

          <strong>
            {totalApplications}
          </strong>
        </div>

        <div className="application-stat-card">
          <span>
            New / Applied
          </span>

          <strong>
            {newApplications}
          </strong>
        </div>

        <div className="application-stat-card">
          <span>
            Shortlisted
          </span>

          <strong>
            {shortlistedApplications}
          </strong>
        </div>

        <div className="application-stat-card">
          <span>
            Selected
          </span>

          <strong>
            {selectedApplications}
          </strong>
        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="applications-toolbar">

        <div className="application-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search candidate, company, email or job..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>
            All Status
          </option>

          {STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="applications-error">
          <strong>
            Error:
          </strong>{" "}
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="applications-empty">

          <Loader2
            size={34}
            className="applications-loader-icon"
          />

          <p>
            Loading applications...
          </p>

        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="applications-empty">

          <div className="applications-empty-icon">
            ◎
          </div>

          <h3>
            No applications found
          </h3>

          <p>
            {applications.length === 0
              ? "No candidate applications have been submitted yet."
              : "No applications match your search or filter."}
          </p>

        </div>
      ) : (
        <div className="applications-table-wrapper">

          <table className="applications-table">

            <thead>
              <tr>
                <th>
                  Candidate
                </th>

                <th>
                  Job Position
                </th>

                <th>
                  Company
                </th>

                <th>
                  Location
                </th>

                <th>
                  Experience
                </th>

                <th>
                  Applied On
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

              {filteredApplications.map(
                (application) => {

                  const companyName =
                    getCompanyName(
                      application
                    );

                  return (
                    <tr
                      key={
                        application._id
                      }
                    >

                      {/* ==========================
                          CANDIDATE
                      =========================== */}

                      <td>

                        <div className="application-candidate">

                          <div className="application-avatar">
                            {application.fullName
                              ? application.fullName
                                  .charAt(0)
                                  .toUpperCase()
                              : "C"}
                          </div>

                          <div>

                            <strong>
                              {application.fullName ||
                                "Unknown Candidate"}
                            </strong>

                            <span>
                              {application.email ||
                                "No email"}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* ==========================
                          JOB
                      =========================== */}

                      <td>

                        <div className="application-job">

                          <strong>
                            {application.jobTitle ||
                              "Job Position"}
                          </strong>

                          <span>
                            {application.jobId ||
                              "—"}
                          </span>

                        </div>

                      </td>

                      {/* ==========================
                          COMPANY
                      =========================== */}

                      <td>

                        <div className="application-company">

                          <div className="application-company-icon">
                            <Building2
                              size={16}
                            />
                          </div>

                          <div className="application-company-info">

                            <strong>
                              {companyName}
                            </strong>

                            <span>
                              Hiring Company
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* ==========================
                          LOCATION
                      =========================== */}

                      <td>
                        {application.currentLocation ||
                          "—"}
                      </td>

                      {/* ==========================
                          EXPERIENCE
                      =========================== */}

                      <td>
                        {application.totalExperience ||
                          "—"}
                      </td>

                      {/* ==========================
                          DATE
                      =========================== */}

                      <td>
                        {formatDate(
                          application.createdAt
                        )}
                      </td>

                      {/* ==========================
                          STATUS
                      =========================== */}

                      <td>

                        <span
                          className={`application-status status-${(
                            application.status ||
                            "Applied"
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {application.status ||
                            "Applied"}
                        </span>

                      </td>

                      {/* ==========================
                          ACTION
                      =========================== */}

                      <td>

                        <NavLink
                          to={`/admin/applications/${application._id}`}
                          className="application-view-btn"
                        >
                          <Eye size={14} />
                          View
                        </NavLink>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Applications;
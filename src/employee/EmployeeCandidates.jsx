import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Clock,
  CheckCircle,
  CalendarDays,
  Eye,
  MapPin,
  Briefcase,
  GraduationCap,
  Loader2,
  Building2,
} from "lucide-react";

import "./EmployeeCandidates.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmployeeCandidates = () => {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================
     FETCH CANDIDATES
  ========================================= */

  const fetchCandidates = async () => {
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
        `${API_BASE_URL}/api/employee/applications`,
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
          "Server returned an invalid response."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load candidates."
        );
      }

      const applications = Array.isArray(data?.data)
        ? data.data
        : [];

      const normalizedCandidates =
        applications.map((application) => ({
          id: application._id,

          fullName:
            application.fullName || "N/A",

          email:
            application.email || "N/A",

          phone:
            application.phone || "N/A",

          currentLocation:
            application.currentLocation ||
            application.preferredLocation ||
            "N/A",

          totalExperience:
            application.totalExperience ||
            "N/A",

          jobTitle:
            application.jobTitle || "N/A",

          companyName:
            application.companyName ||
            "N/A",

          highestQualification:
            application.highestQualification ||
            "N/A",

          preferredLocation:
            application.preferredLocation ||
            "N/A",

          status:
            application.status || "Applied",

          createdAt: application.createdAt
            ? new Date(
                application.createdAt
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
        }));

      setCandidates(normalizedCandidates);
    } catch (err) {
      console.error(
        "Candidate fetch error:",
        err
      );

      setError(
        err.message ||
          "Unable to load candidates."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  /* =========================================
     FILTER CANDIDATES
  ========================================= */

  const filteredCandidates = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !searchText ||
        candidate.fullName
          .toLowerCase()
          .includes(searchText) ||
        candidate.email
          .toLowerCase()
          .includes(searchText) ||
        candidate.jobTitle
          .toLowerCase()
          .includes(searchText) ||
        candidate.companyName
          .toLowerCase()
          .includes(searchText) ||
        candidate.currentLocation
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        candidate.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
  ]);

  /* =========================================
     SUMMARY COUNTS
  ========================================= */

  const totalCandidates =
    candidates.length;

  const pendingCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status === "Applied" ||
        candidate.status ===
          "Under Review"
    ).length;

  const shortlistedCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status ===
        "Shortlisted"
    ).length;

  const interviewCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status === "Interview"
    ).length;

  /* =========================================
     VIEW DETAILS
  ========================================= */

  const handleViewDetails = (
    candidateId
  ) => {
    if (!candidateId) {
      console.error(
        "Candidate ID is missing."
      );
      return;
    }

    navigate(
      `/employee-dashboard/candidates/${candidateId}`
    );
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <main className="employee-candidates-main">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="employee-candidates-header">
        <div>
          <p className="employee-candidates-eyebrow">
            CANDIDATE MANAGEMENT
          </p>

          <h1>
            Candidate Management
          </h1>

          <p>
            Review and manage candidates who
            applied to your jobs.
          </p>
        </div>
      </header>

      {/* =========================================
          SUMMARY
      ========================================= */}

      <section className="employee-candidates-summary">

        <div className="employee-candidates-summary-card">
          <div className="employee-candidates-summary-icon">
            <Users size={20} />
          </div>

          <div>
            <strong>
              {totalCandidates}
            </strong>

            <span>
              Total Candidates
            </span>
          </div>
        </div>

        <div className="employee-candidates-summary-card">
          <div className="employee-candidates-summary-icon">
            <Clock size={20} />
          </div>

          <div>
            <strong>
              {pendingCandidates}
            </strong>

            <span>
              Pending Review
            </span>
          </div>
        </div>

        <div className="employee-candidates-summary-card">
          <div className="employee-candidates-summary-icon">
            <CheckCircle size={20} />
          </div>

          <div>
            <strong>
              {shortlistedCandidates}
            </strong>

            <span>
              Shortlisted
            </span>
          </div>
        </div>

        <div className="employee-candidates-summary-card">
          <div className="employee-candidates-summary-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <strong>
              {interviewCandidates}
            </strong>

            <span>
              Interview
            </span>
          </div>
        </div>

      </section>

      {/* =========================================
          TOOLBAR
      ========================================= */}

      <div className="employee-candidates-toolbar">

        <div className="employee-candidates-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
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

      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (
        <div className="employee-candidates-empty">
          <Loader2
            size={30}
            className="employee-candidates-loader"
          />

          <h3>
            Loading candidates...
          </h3>
        </div>
      )}

      {/* =========================================
          ERROR
      ========================================= */}

      {!loading && error && (
        <div className="employee-candidates-empty">
          <h3>
            Unable to load candidates
          </h3>

          <p>{error}</p>

          <button
            type="button"
            className="employee-candidate-view-btn"
            onClick={fetchCandidates}
            style={{
              marginTop: "15px",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* =========================================
          EMPTY
      ========================================= */}

      {!loading &&
        !error &&
        filteredCandidates.length === 0 && (
          <div className="employee-candidates-empty">

            <Users size={40} />

            <h3>
              No candidates found
            </h3>

            <p>
              No candidates match your
              current search or filter.
            </p>

          </div>
        )}

      {/* =========================================
          CANDIDATES
      ========================================= */}

      {!loading &&
        !error &&
        filteredCandidates.length > 0 && (
          <div className="employee-candidates-list">

            {filteredCandidates.map(
              (candidate) => (
                <article
                  className="employee-candidate-card"
                  key={candidate.id}
                >

                  {/* TOP */}

                  <div className="employee-candidate-top">

                    <div className="employee-candidate-avatar-large">
                      {candidate.fullName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="employee-candidate-heading">

                      <div className="employee-candidate-name-row">

                        <h2>
                          {candidate.fullName}
                        </h2>

                        <span
                          className={`employee-candidate-status ${
                            candidate.status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >
                          {candidate.status}
                        </span>

                      </div>

                      <p>
                        <strong>
                          {candidate.jobTitle}
                        </strong>

                        {" • "}

                        <span className="employee-candidate-company">
                          <Building2 size={14} />
                          {candidate.companyName}
                        </span>

                        {" • "}

                        {candidate.email}
                      </p>

                    </div>

                    {/* VIEW DETAILS */}

                    <button
                      type="button"
                      className="employee-candidate-view-btn"
                      onClick={() =>
                        handleViewDetails(
                          candidate.id
                        )
                      }
                    >
                      <Eye size={15} />
                      View Details
                    </button>

                  </div>

                  {/* INFO */}

                  <div className="employee-candidate-info">

                    <div>
                      <MapPin size={15} />

                      <span>
                        {candidate.currentLocation}
                      </span>
                    </div>

                    <div>
                      <Briefcase size={15} />

                      <span>
                        {candidate.totalExperience}
                      </span>
                    </div>

                    <div>
                      <GraduationCap size={15} />

                      <span>
                        {candidate.highestQualification}
                      </span>
                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="employee-candidate-footer">

                    <div>
                      <span>
                        Applied For
                      </span>

                      <strong>
                        {candidate.jobTitle}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Company
                      </span>

                      <strong>
                        {candidate.companyName}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Applied Date
                      </span>

                      <strong>
                        {candidate.createdAt}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Preferred Location
                      </span>

                      <strong>
                        {candidate.preferredLocation}
                      </strong>
                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

    </main>
  );
};

export default EmployeeCandidates;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = API_BASE_URL;

const conversations = [
  {
    id: "#RC-10284",
    user: "Amit R.",
    topic: "Dubai Jobs",
    status: "Live Agent",
    time: "2 min ago",
    route: "/admin/chatbot-logs",
  },
  {
    id: "#RC-10283",
    user: "Fatima K.",
    topic: "Visa Support",
    status: "AI Resolved",
    time: "8 min ago",
    route: "/admin/chatbot-logs",
  },
  {
    id: "#RC-10282",
    user: "Rahul S.",
    topic: "IT Jobs",
    status: "AI Resolved",
    time: "14 min ago",
    route: "/admin/chatbot-logs",
  },
  {
    id: "#RC-10281",
    user: "Neha P.",
    topic: "Resume Upload",
    status: "Live Agent",
    time: "21 min ago",
    route: "/admin/chatbot-logs",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    conversations: 0,
    candidates: 0,
    employers: 0,
    jobs: 0,
    resumes: 0,
    applications: 0,
    contacts: 0,
    pendingJobs: 0,
    partners: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("September 2026");

  const [showMonths, setShowMonths] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          candidatesRes,
          employersRes,
          jobsRes,
          resumesRes,
          applicationsRes,
          contactsRes,
        ] = await Promise.all([
          fetch(`${API_URL}/api/candidates`),
          fetch(`${API_URL}/api/employers`),

          // ADMIN MUST SEE ALL JOBS
          fetch(`${API_URL}/api/jobs/admin/all`),

          fetch(`${API_URL}/api/resume`),
          fetch(`${API_URL}/api/applications`),
          fetch(`${API_URL}/api/contact`),
        ]);

        if (
          !candidatesRes.ok ||
          !employersRes.ok ||
          !jobsRes.ok ||
          !resumesRes.ok ||
          !applicationsRes.ok ||
          !contactsRes.ok
        ) {
          throw new Error("Unable to load dashboard data.");
        }

        const [
          candidatesData,
          employersData,
          jobsData,
          resumesData,
          applicationsData,
          contactsData,
        ] = await Promise.all([
          candidatesRes.json(),
          employersRes.json(),
          jobsRes.json(),
          resumesRes.json(),
          applicationsRes.json(),
          contactsRes.json(),
        ]);

        const candidates = candidatesData.data || [];
        const employers = employersData.data || [];

        const jobs =
          jobsData.data ||
          jobsData.jobs ||
          [];

        const resumes = resumesData.data || [];
        const applications =
          applicationsData.data || [];
        const contacts =
          contactsData.data || [];

        const pendingJobs = jobs.filter(
          (job) => job.status === "Pending"
        ).length;

        const approvedJobs = jobs.filter(
          (job) => job.status === "Approved"
        ).length;

        setStats({
          conversations:
            contacts.length +
            applications.length,

          candidates: candidates.length,

          employers: employers.length,

          jobs: approvedJobs,

          resumes: resumes.length,

          applications: applications.length,

          contacts: contacts.length,

          pendingJobs,

          partners: 0,
        });
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goTo = (path) => {
    navigate(path);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setShowMonths(false);
  };

  return (
    <div className="dashboard-page">

      {/* ======================================
          PAGE HEADING
      ====================================== */}

      <div className="dashboard-heading">

        <div>
          <p className="dashboard-eyebrow">
            ADMIN OVERVIEW
          </p>

          <h2>Dashboard</h2>

          <span>
            Monitor recruitment activity, chatbot
            conversations and platform performance.
          </span>
        </div>

        <div className="dashboard-month-wrapper">

          <button
            type="button"
            className="dashboard-date"
            onClick={() =>
              setShowMonths(
                (prev) => !prev
              )
            }
          >
            {selectedMonth} ▾
          </button>

          {showMonths && (
            <div className="dashboard-month-menu">

              {[
                "September 2026",
                "August 2026",
                "July 2026",
                "June 2026",
                "May 2026",
              ].map((month) => (
                <button
                  type="button"
                  key={month}
                  onClick={() =>
                    handleMonthChange(
                      month
                    )
                  }
                >
                  {month}
                </button>
              ))}

            </div>
          )}

        </div>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            background: "#fff4f4",
            color: "#b42318",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}


      {/* ======================================
          STAT CARDS
      ====================================== */}

      <div className="dashboard-stats">

        {/* CONVERSATIONS */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/chatbot-logs")
          }
        >
          <div className="stat-top">
            <span>
              Total Conversations
            </span>

            <b>◫</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.conversations}
          </strong>

          <small>
            Contact + application activity
          </small>
        </button>


        {/* APPLICATIONS */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/applications")
          }
        >
          <div className="stat-top">
            <span>
              Job Applications
            </span>

            <b>↗</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.applications}
          </strong>

          <small>
            Total applications received
          </small>
        </button>


        {/* CANDIDATES */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/candidates")
          }
        >
          <div className="stat-top">
            <span>
              Candidates
            </span>

            <b>♙</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.candidates}
          </strong>

          <small>
            Registered candidates
          </small>
        </button>


        {/* JOBS */}

        <button
          type="button"
          className="dashboard-stat dashboard-stat-button"
          onClick={() =>
            goTo("/admin/jobs")
          }
        >
          <div className="stat-top">
            <span>
              Active Jobs
            </span>

            <b>▣</b>
          </div>

          <strong>
            {loading
              ? "..."
              : stats.jobs}
          </strong>

          <small>
            Approved jobs in platform
          </small>
        </button>

      </div>


      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="dashboard-grid">

        {/* ====================================
            RECRUITMENT ACTIVITY
        ==================================== */}

        <section className="dashboard-card chatbot-overview">

          <div className="card-heading">

            <div>
              <p>
                PLATFORM ACTIVITY
              </p>

              <h3>
                Recruitment Activity
              </h3>
            </div>

            <button
              type="button"
              className="online-label"
              onClick={() =>
                goTo("/admin/applications")
              }
            >
              <i></i>
              Live
            </button>

          </div>


          <div className="chatbot-chart">

            <div className="chart-value">

              <strong>
                {loading
                  ? "..."
                  : stats.applications}
              </strong>

              <span>
                applications
              </span>

            </div>


            <div className="fake-chart">

              <div className="chart-line">

                <span
                  style={{
                    height: "38%",
                  }}
                ></span>

                <span
                  style={{
                    height: "52%",
                  }}
                ></span>

                <span
                  style={{
                    height: "44%",
                  }}
                ></span>

                <span
                  style={{
                    height: "68%",
                  }}
                ></span>

                <span
                  style={{
                    height: "57%",
                  }}
                ></span>

                <span
                  style={{
                    height: "78%",
                  }}
                ></span>

                <span
                  style={{
                    height: "72%",
                  }}
                ></span>

                <span
                  style={{
                    height: "91%",
                  }}
                ></span>

              </div>

            </div>


            <div className="chart-days">

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Mon
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Tue
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Wed
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Thu
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Fri
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Sat
              </button>

              <button
                type="button"
                onClick={() =>
                  goTo("/admin/applications")
                }
              >
                Sun
              </button>

            </div>

          </div>

        </section>


        {/* ====================================
            QUICK SUMMARY
        ==================================== */}

        <section className="dashboard-card summary-card">

          <div className="card-heading">

            <div>
              <p>
                PLATFORM
              </p>

              <h3>
                Quick Summary
              </h3>
            </div>

          </div>


          {/* NEW CANDIDATES */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/candidates")
            }
          >
            <span>
              New Candidates
            </span>

            <strong>
              {loading
                ? "..."
                : stats.candidates}
            </strong>
          </button>


          {/* NEW EMPLOYERS */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/employers")
            }
          >
            <span>
              New Employers
            </span>

            <strong>
              {loading
                ? "..."
                : stats.employers}
            </strong>
          </button>


          {/* PENDING JOBS */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/jobs")
            }
          >
            <span>
              Jobs Pending Approval
            </span>

            <strong>
              {loading
                ? "..."
                : stats.pendingJobs}
            </strong>
          </button>


          {/* PARTNERS */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/partners")
            }
          >
            <span>
              Partner Registrations
            </span>

            <strong>
              {loading
                ? "..."
                : stats.partners}
            </strong>
          </button>


          {/* RESUMES */}

          <button
            type="button"
            className="summary-row summary-button"
            onClick={() =>
              goTo("/admin/resumes")
            }
          >
            <span>
              Resumes Uploaded
            </span>

            <strong>
              {loading
                ? "..."
                : stats.resumes}
            </strong>
          </button>

        </section>

      </div>


      {/* ======================================
          RECENT CONVERSATIONS
      ====================================== */}

      <section className="dashboard-card recent-card">

        <div className="card-heading">

          <div>

            <p>
              RECENT ACTIVITY
            </p>

            <h3>
              Recent Chatbot Conversations
            </h3>

          </div>


          <button
            type="button"
            className="dashboard-view-all"
            onClick={() =>
              goTo("/admin/chatbot-logs")
            }
          >
            View All →
          </button>

        </div>


        <div className="dashboard-table-wrapper">

          <table className="dashboard-table">

            <thead>

              <tr>

                <th>
                  Conversation
                </th>

                <th>
                  User
                </th>

                <th>
                  Topic
                </th>

                <th>
                  Status
                </th>

                <th>
                  Last Activity
                </th>

              </tr>

            </thead>


            <tbody>

              {conversations.map(
                (item) => (

                  <tr
                    key={item.id}
                    className="conversation-row"
                    onClick={() =>
                      goTo(item.route)
                    }
                  >

                    <td>
                      <strong>
                        {item.id}
                      </strong>
                    </td>

                    <td>
                      {item.user}
                    </td>

                    <td>
                      {item.topic}
                    </td>

                    <td>

                      <span
                        className={
                          item.status ===
                          "Live Agent"
                            ? "status-badge live"
                            : "status-badge resolved"
                        }
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>
                      {item.time}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;
import { useState } from "react";
import "./AdminDashboard.css";

function getStoredAdminName() {
  try {
    const savedAdmin = JSON.parse(localStorage.getItem("ragasAdmin") || "{}");
    return savedAdmin?.fullName || "Admin";
  } catch {
    return "Admin";
  }
}

const conversations = [
  {
    id: "#RC-10284",
    user: "Amit R.",
    topic: "Dubai Jobs",
    status: "Live Agent",
    time: "2 min ago",
  },
  {
    id: "#RC-10283",
    user: "Fatima K.",
    topic: "Visa Support",
    status: "AI Resolved",
    time: "8 min ago",
  },
  {
    id: "#RC-10282",
    user: "Rahul S.",
    topic: "IT Jobs",
    status: "AI Resolved",
    time: "14 min ago",
  },
  {
    id: "#RC-10281",
    user: "Neha P.",
    topic: "Resume Upload",
    status: "Live Agent",
    time: "21 min ago",
  },
  {
    id: "#RC-10280",
    user: "Mohammed A.",
    topic: "Work Permit",
    status: "AI Resolved",
    time: "32 min ago",
  },
];

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const adminName = getStoredAdminName();

  const filteredConversations = conversations.filter((item) =>
    `${item.user} ${item.topic} ${item.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <strong>RAGAS</strong>
          <span>CAREER WORLD</span>
        </div>

        <div className="admin-user">
          <div className="admin-avatar">{adminName?.charAt(0)?.toUpperCase() || "A"}</div>

          <div>
            <strong>{adminName}</strong>
            <span>Administrator</span>
          </div>
        </div>

        <nav className="admin-nav">

          <a href="#overview" className="active">
            <span>▦</span>
            Dashboard
          </a>

          <a href="#conversations">
            <span>◫</span>
            Chatbot Logs
          </a>

          <a href="#candidates">
            <span>♙</span>
            Candidates
          </a>

          <a href="#employers">
            <span>▤</span>
            Employers
          </a>

          <a href="#jobs">
            <span>▣</span>
            Job Posts
          </a>

          <a href="#resumes">
            <span>↥</span>
            Resume Database
          </a>

          <a href="#partners">
            <span>◎</span>
            Partners
          </a>

        </nav>

        <button className="admin-logout">
          ← Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="admin-content">

        {/* TOP BAR */}
        <header className="admin-topbar">

          <div>
            <p>ADMIN DASHBOARD</p>
            <h1>Overview</h1>
          </div>

          <div className="admin-top-actions">
            <span className="admin-live">
              <i></i>
              System Online
            </span>

            <button>View Website ↗</button>
          </div>

        </header>

        {/* STATS */}
        <section className="admin-stats" id="overview">

          <div className="admin-stat-card">
            <span>Total Conversations</span>
            <strong>1,284</strong>
            <small>Across all website pages</small>
          </div>

          <div className="admin-stat-card">
            <span>Live Agent Handoffs</span>
            <strong>312</strong>
            <small>24.3% of conversations</small>
          </div>

          <div className="admin-stat-card">
            <span>Profile Linked</span>
            <strong>96%</strong>
            <small>Candidate / employer profiles</small>
          </div>

          <div className="admin-stat-card">
            <span>Active Jobs</span>
            <strong>214</strong>
            <small>Current published openings</small>
          </div>

        </section>

        {/* CHATBOT LOG */}
        <section className="conversation-section" id="conversations">

          <div className="section-header">

            <div>
              <p>AI CHATBOT</p>
              <h2>Chatbot Conversation Log</h2>
            </div>

            <button className="export-btn">
              Export CSV
            </button>

          </div>

          {/* SEARCH */}
          <div className="conversation-toolbar">

            <div className="conversation-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select defaultValue="all">
              <option value="all">All Status</option>
              <option value="AI Resolved">AI Resolved</option>
              <option value="Live Agent">Live Agent</option>
            </select>

            <select defaultValue="all">
              <option value="all">All Topics</option>
              <option value="Jobs">Jobs</option>
              <option value="Visa">Visa Support</option>
              <option value="Resume">Resume</option>
            </select>

          </div>

          {/* TABLE */}
          <div className="conversation-table-wrapper">

            <table className="conversation-table">

              <thead>
                <tr>
                  <th>Conversation</th>
                  <th>User</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Last Activity</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {filteredConversations.map((item) => (
                  <tr key={item.id}>

                    <td>
                      <strong>{item.id}</strong>
                    </td>

                    <td>{item.user}</td>

                    <td>{item.topic}</td>

                    <td>
                      <span
                        className={`conversation-status ${
                          item.status === "Live Agent"
                            ? "live-agent"
                            : "ai-resolved"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>{item.time}</td>

                    <td>
                      <button className="view-conversation">
                        View
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

        {/* BOTTOM INFORMATION */}
        <section className="admin-info-grid">

          <div className="admin-info-card">

            <div className="info-card-icon">◉</div>

            <div>
              <h3>Role-Based Access</h3>
              <p>
                Super Admin, Recruiter, Content Editor and
                Partner Manager permissions.
              </p>
            </div>

          </div>

          <div className="admin-info-card">

            <div className="info-card-icon">✓</div>

            <div>
              <h3>Conversation Monitoring</h3>
              <p>
                Review chatbot conversations and hand off
                complex requests to live agents.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, Award, Calendar, XCircle, CheckCircle, ArrowLeft, Briefcase, Loader2 } from "lucide-react";
import "./ApplicationStatus.css";

export function ApplicationStatus() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const savedUser = localStorage.getItem("ragasUser") || sessionStorage.getItem("ragasUser");
        if (!savedUser) {
          navigate("/user-login");
          return;
        }
        
        const user = JSON.parse(savedUser);
        const userEmail = user.email;

        if (!userEmail) {
          setError("User email not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/applications/candidate?email=${encodeURIComponent(userEmail)}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("ragasUserToken") || ""}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setApplications(data.data || []);
        } else {
          setError(data.message || "Failed to load application status.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong connecting to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  // Helper to determine stage highlights including Selected & Rejected
  const getStageFlags = (status) => {
    const s = (status || "").toLowerCase();
    const isRejected = s === "rejected";
    const isSelected = s === "selected";

    return {
      applied: true,
      viewed: ["under review", "shortlisted", "interview", "selected", "rejected"].includes(s),
      shortlisted: ["shortlisted", "interview", "selected"].includes(s),
      interview: ["interview", "selected"].includes(s),
      selected: isSelected,
      rejected: isRejected,
    };
  };

  return (
    <div className="application-status-page">
      <div className="status-container">
        <button className="back-home-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="status-header">
          <h1>My Job Application Status</h1>
          <p>Track the live progress of your job applications submitted through RAGAS.</p>
        </div>

        {loading ? (
          <div className="status-loading" style={{ textAlign: "center", padding: "40px" }}>
            <Loader2 className="spinner" size={32} style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: "10px" }}>Loading your application statuses...</p>
          </div>
        ) : error ? (
          <div className="status-error-box" style={{ padding: "20px", color: "red", textAlign: "center" }}>
            <p>{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="no-applications-box" style={{ textAlign: "center", padding: "40px" }}>
            <Briefcase size={48} style={{ opacity: 0.5, marginBottom: "15px" }} />
            <h3>No Applications Found</h3>
            <p>You haven't applied to any jobs yet. Check out current openings to apply!</p>
            <button 
              className="browse-jobs-btn" 
              onClick={() => navigate("/current-openings")}
              style={{ marginTop: "15px", padding: "10px 20px", cursor: "pointer" }}
            >
              Browse Openings
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => {
              const stages = getStageFlags(app.status);
              const currentStatusText = app.status || "Applied";
              const isRejected = currentStatusText.toLowerCase() === "rejected";

              return (
                <div key={app._id} className="application-card">
                  <div className="app-card-top">
                    <div className="job-meta">
                      <span className="job-icon-box"><Briefcase size={20} /></span>
                      <div>
                        <h2>{app.jobTitle}</h2>
                        <p className="app-company">
                          {app.currentCompany || "RAGAS Career World"} {app.currentLocation ? `• ${app.currentLocation}` : ""}
                        </p>
                        <span className="app-date">
                          Applied on: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`status-pill ${currentStatusText.toLowerCase().replace(/\s+/g, '-')}`}>
                      {currentStatusText}
                    </span>
                  </div>

                  {/* Progress Tracker with Selected / Rejected Support */}
                  <div className="tracker-steps">
                    <div className={`tracker-step ${stages.applied ? "completed" : ""}`}>
                      <div className="step-circle"><CheckCircle2 size={16} /></div>
                      <span>Applied</span>
                    </div>

                    <div className={`tracker-line ${stages.viewed ? "completed" : ""}`}></div>

                    <div className={`tracker-step ${stages.viewed ? "completed" : ""}`}>
                      <div className="step-circle"><Eye size={16} /></div>
                      <span>Under Review</span>
                    </div>

                    <div className={`tracker-line ${stages.shortlisted ? "completed" : ""}`}></div>

                    <div className={`tracker-step ${stages.shortlisted ? "completed" : ""}`}>
                      <div className="step-circle"><Award size={16} /></div>
                      <span>Shortlisted</span>
                    </div>

                    <div className={`tracker-line ${stages.interview ? "completed" : ""}`}></div>

                    <div className={`tracker-step ${stages.interview ? "completed" : "pending"}`}>
                      <div className="step-circle"><Calendar size={16} /></div>
                      <span>Interview</span>
                    </div>

                    <div className={`tracker-line ${stages.selected || stages.rejected ? "completed" : ""}`}></div>

                    <div className={`tracker-step ${stages.selected ? "completed" : stages.rejected ? "rejected" : "pending"}`}>
                      <div className="step-circle">
                        {stages.selected ? <CheckCircle size={16} /> : stages.rejected ? <XCircle size={16} /> : <Calendar size={16} />}
                      </div>
                      <span>{stages.rejected ? "Rejected" : "Selected"}</span>
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
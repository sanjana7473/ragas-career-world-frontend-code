import { useNavigate } from "react-router-dom";
import "./JobSeekers.css";

function JobSeekers() {
  const navigate = useNavigate();
  return (
    <main className="job-seekers-page">

      <section className="job-seekers-main">

        {/* HERO */}
        <div className="job-seekers-hero">

          <p className="job-seekers-eyebrow">
            FOR JOB SEEKERS
          </p>

          <h1>
            Build your career, globally.
          </h1>

          <p className="job-seekers-description">
            Search domestic and overseas roles, upload your resume once,
            and track every application from your personal dashboard.
          </p>

          <div className="job-seekers-actions">
            <a
              href="#upload-resume"
              className="job-seekers-btn primary"
            >
              Register / Upload Resume
            </a>

            <a
              href="/current-openings"
              className="job-seekers-btn secondary"
              onClick={(event) => {
                event.preventDefault();
                navigate("/current-openings");
              }}
            >
              Browse Openings
            </a>
          </div>

        </div>

        <div className="job-seekers-features">

          <div className="job-seekers-feature">
            <span>✓</span>
            <p>One-click Apply Online + application tracking</p>
          </div>

          <div className="job-seekers-feature">
            <span>✓</span>
            <p>Secure resume/CV upload &amp; profile builder</p>
          </div>

          <div className="job-seekers-feature">
            <span>✓</span>
            <p>Job alerts via email / WhatsApp</p>
          </div>

        </div>

        <div className="career-resources">

          <p className="resources-eyebrow">
            CAREER RESOURCES
          </p>

          <div className="resources-grid">

            <div className="resource-card">
              <h3>Resume Tips</h3>
              <p>Craft a resume recruiters notice</p>
            </div>

            <div className="resource-card">
              <h3>Interview Prep</h3>
              <p>Common questions &amp; country-specific etiquette</p>
            </div>

            <div className="resource-card">
              <h3>Visa Guidance</h3>
              <p>What documents you’ll need, by country</p>
            </div>

          </div>

        </div>

      </section>


    </main>
  );
}

export default JobSeekers;

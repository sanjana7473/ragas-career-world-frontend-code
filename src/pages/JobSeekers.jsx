import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobSeekers.css";
import jobSeekerImage from "../assets/job-seeker-illustration.png";

/* =========================================================
   DATA
   ========================================================= */

const MINI_INFO = [
  {
    number: "01",
    title: "Profile",
    text: "Build your professional profile.",
  },
  {
    number: "02",
    title: "Opportunity",
    text: "Discover relevant career openings.",
  },
  {
    number: "03",
    title: "Support",
    text: "Move forward with expert guidance.",
  },
];

/* =========================================================
   JOB SEEKERS OVERVIEW
   ========================================================= */

function JobSeekersOverview({ onRegisterResume, onBrowseOpenings }) {
  return (
    <section className="job-seekers-hero">

      {/* LEFT CONTENT */}
      <div className="job-seekers-hero-content">

        <div className="job-seekers-eyebrow reveal" style={{ "--i": 0 }}>
          For job seekers
        </div>

        <h1 className="reveal" style={{ "--i": 1 }}>
          <span className="h1-line">Build your career</span>
          <span className="h1-line h1-accent">globally.</span>
        </h1>

        <p
          className="job-seekers-description reveal"
          style={{ "--i": 2 }}
        >
          Search domestic and overseas roles, upload your resume
          and track every application from your personal dashboard.
        </p>

        <div
          className="job-seekers-actions reveal"
          style={{ "--i": 3 }}
        >
         

          <button
            type="button"
            className="job-seekers-btn secondary"
            onClick={onBrowseOpenings}
          >
            <span className="btn-label">Browse Openings</span>
            <span className="btn-icon" aria-hidden="true">→</span>
          </button>
        </div>

        {/* SMALL INFO ROW */}
        <ul className="job-seekers-mini-info reveal" style={{ "--i": 4 }}>
          {MINI_INFO.map((item) => (
            <li className="job-seekers-mini-item" key={item.number}>
              <span className="mini-number">{item.number}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT IMAGE */}
      <div className="job-seekers-visual reveal-visual">

        <div className="job-seekers-image-glow"></div>

        <div className="job-seekers-image-ring ring-one"></div>
        <div className="job-seekers-image-ring ring-two"></div>

        <div className="job-seekers-image-card">
          <img
            src={jobSeekerImage}
            alt="Job seeker exploring career opportunities"
            className="job-seeker-image"
          />
        </div>

        {/* FLOATING LABELS */}
        <div className="job-seekers-floating-card card-top">
          
          <div>
            <strong>Build</strong>
            <small>Your profile</small>
          </div>
        </div>

        <div className="job-seekers-floating-card card-bottom">
          <span className="floating-dot"></span>
          <div>
            <strong>Career</strong>
            <small>Opportunity awaits</small>
          </div>
        </div>

      </div>

    </section>
  );
}

/* =========================================================
   MAIN JOB SEEKERS PAGE
   ========================================================= */

function JobSeekers() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [inView, setInView] = useState(false);

  /* Starts the entrance when the section is actually on screen
     (it sits far down the Home page, so load-time CSS would be wasted) */
  useEffect(() => {
    const el = pageRef.current;

    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  /* -----------------------------------------
     LOGIN CHECK
     ----------------------------------------- */

  const isUserLoggedIn =
    localStorage.getItem("ragasUserLoggedIn") === "true" ||
    sessionStorage.getItem("ragasUserLoggedIn") === "true";

  const handleRegisterResume = () => {
    navigate(isUserLoggedIn ? "/upload-resume" : "/user-registration");
  };

  const handleBrowseOpenings = () => {
    navigate(isUserLoggedIn ? "/current-openings" : "/user-registration");
  };

  return (
    <main
      ref={pageRef}
      className={`job-seekers-page${inView ? " is-in" : ""}`}
    >

      {/* BACKGROUND DECORATION */}
      <div className="job-seekers-bg-orb orb-one"></div>
      <div className="job-seekers-bg-orb orb-two"></div>
      <div className="job-seekers-grid"></div>

      {/* MAIN CONTENT */}
      <div className="job-seekers-main">

        {/* TOP BAR */}
        <div className="job-seekers-topbar">
          
          <span className="topbar-line"></span>
    
        </div>

        {/* HERO */}
        <JobSeekersOverview
          onRegisterResume={handleRegisterResume}
          onBrowseOpenings={handleBrowseOpenings}
        />

        {/* BOTTOM BRAND LINE */}
        <div className="job-seekers-bottom">
          <span>People</span>
          <i></i>
          <span>Opportunity</span>
          <i></i>
          <span>Career</span>
        </div>

      </div>

    </main>
  );
}

export default JobSeekers;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Settings,
  BarChart3,
  Plane,
  Shield,
  Search,
  ArrowRight,
} from "lucide-react";

import "./HomeServices.css";

const services = [
  {
    icon: Briefcase,
    title: "Permanent Staffing",
    description:
      "End-to-end recruitment support for full-time positions.",
    category: "Talent sourcing",
    points: [
      "Role analysis and job description support",
      "Screened and shortlisted candidates",
      "Interview coordination and feedback",
      "Offer and joining follow-up",
    ],
  },
  {
    icon: BarChart3,
    title: "Executive Search",
    description:
      "Confidential recruitment for leadership and senior positions.",
    category: "Talent sourcing",
    points: [
      "Confidential leadership hiring",
      "Direct approach to senior professionals",
      "Detailed candidate profiling",
      "Support through final selection",
    ],
  },
  {
    icon: Settings,
    title: "Contract Staffing",
    description:
      "Flexible workforce solutions for temporary and project roles.",
    category: "Staffing",
    points: [
      "Temporary and project-based roles",
      "Quick team scaling up or down",
      "Contract and onboarding support",
      "Replacement support when needed",
    ],
  },
  {
    icon: Search,
    title: "Candidate Sourcing",
    description:
      "Targeted talent sourcing and screening for defined requirements.",
    category: "Staffing",
    points: [
      "Targeted search across talent pools",
      "Resume screening and verification",
      "Skill and requirement matching",
      "Ready-to-interview shortlists",
    ],
  },
  {
    icon: Plane,
    title: "Overseas Placement",
    description:
      "Connecting qualified professionals with global opportunities.",
    category: "Global careers",
    points: [
      "Opportunities with international employers",
      "Profile preparation for overseas roles",
      "Interview and selection support",
      "Guidance until deployment",
    ],
  },
  {
    icon: Shield,
    title: "Visa Assistance",
    description:
      "Documentation and work-permit guidance for overseas employment.",
    category: "Global careers",
    points: [
      "Document checklist and review",
      "Work-permit application guidance",
      "Status follow-up",
      "Clear support at each step",
    ],
  },
];

function HomeServices() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const handleServiceClick = (index) => {
    setActive(index);
  };

  return (
    <section className="home-services">
      <div className="sv-container">

        {/* =========================
            INTRO
        ========================== */}
        <header className="sv-intro">

          <p className="sv-eyebrow">
            Our services
          </p>

          <h2>
            Where talent meets{" "}
            <em>opportunity.</em>
          </h2>

          <p className="sv-intro-text">
            Professional recruitment solutions connecting employers and
            professionals across domestic and international markets.
          </p>

          <button
            type="button"
            className="sv-cta"
            onClick={() => navigate("/contact")}
          >
            <span>Talk to our team</span>
            <ArrowRight size={17} />
          </button>

        </header>


        {/* =========================
            SERVICES GRID
        ========================== */}
        <div
          className="sv-services-grid"
          role="group"
          aria-label="Our recruitment services"
        >

          {services.map(
            ({ icon: Icon, title, category, description }, index) => (
              <button
                key={title}
                type="button"
                className={`sv-service-card ${
                  active === index ? "is-active" : ""
                }`}
                aria-pressed={active === index}
                onClick={() => handleServiceClick(index)}
              >

                {/* CARD TOP */}
                <div className="sv-card-top">

                  <span className="sv-card-icon">
                    <Icon
                      size={25}
                      strokeWidth={1.7}
                    />
                  </span>

                  <ArrowRight
                    className="sv-card-arrow"
                    size={19}
                    aria-hidden="true"
                  />

                </div>


                {/* CARD CONTENT */}
                <div className="sv-card-content">

                  <span className="sv-card-category">
                    {category}
                  </span>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {description}
                  </p>

                </div>

              </button>
            )
          )}

        </div>


        {/* =========================
            ACTIVE SERVICE DETAILS
        ========================== */}
        <div className="sv-active-service">

          <div className="sv-active-label">
            Selected service
          </div>

          <div className="sv-active-content">

            <div>
              <span className="sv-active-category">
                {services[active].category}
              </span>

              <h3>
                {services[active].title}
              </h3>

              <p>
                {services[active].description}
              </p>
            </div>


            <ul className="sv-active-points">

              {services[active].points.map((point) => (
                <li key={point}>
                  <span className="sv-check">
                    ✓
                  </span>

                  <span>
                    {point}
                  </span>
                </li>
              ))}

            </ul>


            <button
              type="button"
              className="sv-enquire"
              onClick={() => navigate("/contact")}
            >
              <span>
                Enquire about {services[active].title}
              </span>

              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeServices;
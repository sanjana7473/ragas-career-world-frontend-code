import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Globe,
  MapPin,
  Briefcase,
  ArrowRight,
} from "lucide-react";

import "./InternationalJobs.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const regions = [
  {
    title: "Gulf / Middle East",
    roles: "86 roles",
  },
  {
    title: "Europe",
    roles: "41 roles",
  },
  {
    title: "Canada",
    roles: "23 roles",
  },
  {
    title: "Australia",
    roles: "19 roles",
  },
  {
    title: "Asia",
    roles: "34 roles",
  },
];

// const jobs = [
//   {
//     id: "registered-nurse-gulf",
//     title: "Registered Nurse",
//     category: "Healthcare",
//     location: "Dubai, UAE",
//     salary: "AED 6,000–8,500",
//   },
//   {
//     id: "civil-site-engineer-riyadh",
//     title: "Civil Site Engineer",
//     category: "Construction",
//     location: "Riyadh, KSA",
//     salary: "SAR 8,000–11,000",
//   },
//   {
//     id: "hotel-fnb-manager-doha",
//     title: "Hotel F&B Manager",
//     category: "Hospitality",
//     location: "Doha, Qatar",
//     salary: "QAR 7,000–9,500",
//   },
//   {
//     id: "warehouse-supervisor-toronto",
//     title: "Warehouse Supervisor",
//     category: "Logistics",
//     location: "Toronto, Canada",
//     salary: "CAD 4,200–5,000",
//   },
// ];

function FeaturedInternationalJobs({ onApply, onViewJobs }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternationalJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch jobs");
        }

        const allJobs = result.data || [];

        const internationalJobs = allJobs.filter((job) => {
          const country = String(job.country || "")
            .trim()
            .toLowerCase();

          return country !== "india";
        });

        setJobs(internationalJobs.slice(0, 4));
      } catch (error) {
        console.error("International Jobs Error:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternationalJobs();
  }, []);

  return (
    <div className="international-jobs">

      <div className="international-section-header">

        <div>

          <p className="jobs-eyebrow">
            FEATURED OVERSEAS ROLES
          </p>

          <h2>
            Current International Opportunities
          </h2>

        </div>

        <button
          type="button"
          className="view-all-jobs"
          onClick={onViewJobs}
        >
          View All Jobs
          <ArrowRight size={16} />
        </button>

      </div>

      <div className="international-job-list">

        {loading ? (

          <div className="jobs-loading">
            Loading international jobs...
          </div>

        ) : jobs.length === 0 ? (

          <div className="jobs-empty">
            No international jobs available at the moment.
          </div>

        ) : (

          jobs.map((job) => (

            <div
              className="international-job-card"
              key={job._id}
            >

              <div className="international-job-info">

                <div className="job-icon">
                  <Briefcase
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div>

                  <h3>
                    {job.jobTitle}
                  </h3>

                  <p>
                    {job.category || "General"}

                    <span className="job-dot">
                      •
                    </span>

                    <MapPin
                      size={12}
                      strokeWidth={1.8}
                    />

                    {job.location}
                    {job.country ? `, ${job.country}` : ""}
                  </p>

                </div>

              </div>

              <div className="international-job-action">

                <strong>
                  {job.salary || "Salary not disclosed"}
                </strong>

                <button
                  type="button"
                  onClick={() => onApply(job._id)}
                >
                  Apply
                  <ArrowRight size={14} />
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

function InternationalJobs({ featuredOnly = false }) {
  const navigate = useNavigate();

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const handleViewJobs = () => {
    navigate("/current-openings");
  };

  if (featuredOnly) {
  return (
    <main className="international-page featured-international-page">
        <section className="international-main">
          <FeaturedInternationalJobs
            onApply={handleApply}
            onViewJobs={handleViewJobs}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="international-page">

      {/* ================= MAIN ================= */}

      <section className="international-main">

        {/* ================= HEADER ================= */}

        <div className="international-heading">

          <p className="international-eyebrow">
            OVERSEAS OPPORTUNITIES
          </p>

          <h1>
            International Jobs
          </h1>

          <p className="international-description">
            Explore international career opportunities with trusted
            employers across the Gulf, Europe, Canada, Australia and Asia.
            RAGAS CAREER WORLD connects qualified professionals with
            overseas opportunities and provides guidance throughout the
            recruitment and placement process.
          </p>

        </div>


        {/* ================= INTRO CONTENT ================= */}

        <div className="international-intro">

          <div className="international-intro-card">

            <span className="intro-number">
              01
            </span>

            <div>
              <h3>
                Global Career Opportunities
              </h3>

              <p>
                Access carefully sourced international vacancies across
                multiple industries, including healthcare, construction,
                hospitality, engineering, logistics, IT, aviation and
                professional services.
              </p>
            </div>

          </div>


          <div className="international-intro-card">

            <span className="intro-number">
              02
            </span>

            <div>
              <h3>
                End-to-End Recruitment Support
              </h3>

              <p>
                From application and candidate screening to documentation,
                employer coordination and overseas placement, our team
                supports job seekers throughout the recruitment journey.
              </p>
            </div>

          </div>


          <div className="international-intro-card">

            <span className="intro-number">
              03
            </span>

            <div>
              <h3>
                Visa & Immigration Guidance
              </h3>

              <p>
                Receive practical guidance for employment documentation,
                visa requirements, work permits and other processes related
                to international employment.
              </p>
            </div>

          </div>

        </div>


        {/* ================= REGIONS ================= */}

        <div className="international-section-header">

          <div>
            <p className="jobs-eyebrow">
              DESTINATIONS
            </p>

            <h2>
              Explore Jobs by Region
            </h2>
          </div>

        </div>


        <div className="region-grid">

          {regions.map((region, index) => (

            <div
              className="region-card"
              key={index}
            >

              <div className="region-icon">
                <Globe
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <div>

                <h3>
                  {region.title}
                </h3>

                <span>
                  {region.roles}
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* ================= FEATURED JOBS ================= */}

        <FeaturedInternationalJobs
          onApply={handleApply}
          onViewJobs={handleViewJobs}
        />


        {/* ================= INDUSTRIES ================= */}

        <section className="international-industries">

          <div className="international-section-header">

            <div>

              <p className="jobs-eyebrow">
                GLOBAL RECRUITMENT
              </p>

              <h2>
                International Hiring Across Industries
              </h2>

            </div>

          </div>


          <div className="international-industry-grid">

            <span>Healthcare & Nursing</span>
            <span>Construction & Civil Engineering</span>
            <span>Hospitality & Hotels</span>
            <span>Information Technology</span>
            <span>Logistics & Warehousing</span>
            <span>Engineering & Manufacturing</span>
            <span>Aviation & Airports</span>
            <span>Banking & Financial Services</span>
            <span>Oil & Gas</span>
            <span>Retail & E-commerce</span>
            <span>Education & Training</span>
            <span>Security Services</span>

          </div>

        </section>


        {/* ================= PROCESS ================= */}

        <section className="international-process">

          <div className="international-section-header">

            <div>

              <p className="jobs-eyebrow">
                HOW IT WORKS
              </p>

              <h2>
                Your International Recruitment Journey
              </h2>

            </div>

          </div>


          <div className="international-process-grid">

            <div className="process-step">
              <span>01</span>
              <h3>Explore Opportunities</h3>
              <p>
                Browse international vacancies based on your skills,
                experience, industry and preferred destination.
              </p>
            </div>

            <div className="process-step">
              <span>02</span>
              <h3>Submit Your Application</h3>
              <p>
                Apply for a suitable position and submit your professional
                details and required documents.
              </p>
            </div>

            <div className="process-step">
              <span>03</span>
              <h3>Screening & Selection</h3>
              <p>
                Our recruitment team evaluates your profile and coordinates
                the next stages with the relevant employer.
              </p>
            </div>

            <div className="process-step">
              <span>04</span>
              <h3>Placement Support</h3>
              <p>
                Selected candidates receive support with documentation,
                employer coordination and overseas placement processes.
              </p>
            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}

        <section className="international-cta">

          <div>

            <p className="jobs-eyebrow">
              BUILD YOUR GLOBAL CAREER
            </p>

            <h2>
              Ready to explore international opportunities?
            </h2>

            <p>
              Upload your resume and let our recruitment team connect your
              profile with suitable overseas opportunities.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("/upload-resume")}
          >
            Upload Your Resume
            <ArrowRight size={16} />
          </button>

        </section>

      </section>

    </main>
  );
}

export default InternationalJobs;
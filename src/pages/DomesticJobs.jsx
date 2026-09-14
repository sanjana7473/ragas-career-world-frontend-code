import {
  MapPin,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./DomesticJobs.css";

const states = [
  {
    name: "Maharashtra",
    openings: "58 openings",
  },
  {
    name: "Karnataka",
    openings: "47 openings",
  },
  {
    name: "Delhi NCR",
    openings: "39 openings",
  },
  {
    name: "Tamil Nadu",
    openings: "31 openings",
  },
  {
    name: "Telangana",
    openings: "26 openings",
  },
  {
    name: "Gujarat",
    openings: "21 openings",
  },
];

const jobs = [
  {
    id: "software-developer-bengaluru",
    title: "Software Developer",
    category: "IT",
    location: "Bengaluru, KA",
  },
  {
    id: "bank-relationship-manager-mumbai",
    title: "Bank Relationship Manager",
    category: "Banking",
    location: "Mumbai, MH",
  },
  {
    id: "plant-operations-head-pune",
    title: "Plant Operations Head",
    category: "Manufacturing",
    location: "Pune, MH",
  },
  {
    id: "airport-customer-service-hyderabad",
    title: "Airport Customer Service",
    category: "Aviation",
    location: "Hyderabad, TS",
  },
];

function DomesticJobs() {
  const navigate = useNavigate();

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  return (
    <main className="domestic-page">

      <section className="domestic-main">

        <div className="domestic-heading">

          <p className="domestic-eyebrow">
            PAN-INDIA RECRUITMENT
          </p>

          <h1>
            Domestic Jobs
          </h1>

        </div>

        <div className="state-grid">

          {states.map((state, index) => (
            <div
              className="state-card"
              key={index}
            >

              <div className="state-icon">
                <MapPin size={17} />
              </div>

              <div>
                <h3>
                  {state.name}
                </h3>

                <span>
                  {state.openings}
                </span>
              </div>

            </div>
          ))}

        </div>

        <div className="domestic-openings">

          <p className="openings-eyebrow">
            FEATURED OPENINGS — MNCs, Startups & Government Projects
          </p>

          <div className="domestic-job-list">

            {jobs.map((job) => (
              <div
                className="domestic-job-card"
                key={job.id}
              >

                <div className="domestic-job-info">

                  <div className="domestic-job-icon">
                    <Briefcase size={16} />
                  </div>

                  <div>

                    <h3>
                      {job.title}
                    </h3>

                    <p>
                      {job.category}
                      <span>•</span>
                      {job.location}
                    </p>

                  </div>

                </div>

                <div className="domestic-job-action">

                  <span>
                    Full-time
                  </span>

                  <button
                    type="button"
                    onClick={() => handleApply(job.id)}
                  >
                    Apply
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default DomesticJobs;
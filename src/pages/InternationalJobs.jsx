import { useNavigate } from "react-router-dom";

import {
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";

import "./InternationalJobs.css";

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

const jobs = [
  {
    id: "registered-nurse-gulf",
    title: "Registered Nurse",
    category: "Healthcare",
    location: "Dubai, UAE",
    salary: "AED 6,000–8,500",
  },
  {
    id: "civil-site-engineer-riyadh",
    title: "Civil Site Engineer",
    category: "Construction",
    location: "Riyadh, KSA",
    salary: "SAR 8,000–11,000",
  },
  {
    id: "hotel-fnb-manager-doha",
    title: "Hotel F&B Manager",
    category: "Hospitality",
    location: "Doha, Qatar",
    salary: "QAR 7,000–9,500",
  },
  {
    id: "warehouse-supervisor-toronto",
    title: "Warehouse Supervisor",
    category: "Logistics",
    location: "Toronto, Canada",
    salary: "CAD 4,200–5,000",
  },
];

function InternationalJobs() {
  const navigate = useNavigate();

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  return (
    <main className="international-page">

      {/* ================= MAIN ================= */}

      <section className="international-main">

        {/* HEADER */}

        <div className="international-heading">

          <p className="international-eyebrow">
            OVERSEAS OPPORTUNITIES
          </p>

          <h1>
            International Jobs
          </h1>

        </div>


        {/* ================= REGIONS ================= */}

        <div className="region-grid">

          {regions.map((region, index) => (

            <div
              className="region-card"
              key={index}
            >

              <div className="region-icon">
                <Globe size={18} />
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

        <div className="international-jobs">

          <p className="jobs-eyebrow">
            FEATURED OVERSEAS ROLES
          </p>

          <div className="international-job-list">

            {jobs.map((job) => (

              <div
                className="international-job-card"
                key={job.id}
              >

                <div className="international-job-info">

                  <div className="job-icon">
                    <Briefcase size={17} />
                  </div>

                  <div>

                    <h3>
                      {job.title}
                    </h3>

                    <p>
                      {job.category}
                      <span>•</span>
                      <MapPin size={12} />
                      {job.location}
                    </p>

                  </div>

                </div>


                <div className="international-job-action">

                  <strong>
                    {job.salary}
                  </strong>

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

export default InternationalJobs;
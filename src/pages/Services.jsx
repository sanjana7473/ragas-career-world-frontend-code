import {
  Briefcase,
  Settings,
  BarChart3,
  Plane,
  Shield,
  FileCheck,
} from "lucide-react";

import "./Services.css";

const services = [
  {
    icon: Briefcase,
    title: "Permanent Staffing",
    description:
      "End-to-end sourcing, screening & placement for full-time roles.",
  },
  {
    icon: Settings,
    title: "Contract Staffing",
    description:
      "Flexible, project-based workforce deployment across industries.",
  },
  {
    icon: BarChart3,
    title: "Executive Search",
    description:
      "Confidential, retained search for leadership & senior roles.",
  },
  {
    icon: Plane,
    title: "Overseas Placement",
    description:
      "International hiring for Gulf, Europe, Canada, Australia & Asia.",
  },
  {
    icon: Settings,
    title: "RPO (Recruitment Process Outsourcing)",
    description:
      "End-to-end managed hiring for high-volume employer needs.",
  },
  {
    icon: Shield,
    title: "Visa & Immigration Assistance",
    description:
      "Documentation & work-permit guidance for overseas placements.",
  },
];

function Services() {
  return (
    <main className="services-page">

    

      <section className="services-main">

        <div className="services-heading">

          <p className="services-eyebrow">
            WHAT WE OFFER
          </p>

          <h1>
            Our Recruitment Services
          </h1>

        </div>

        

        <div className="services-grid">

          {services.map((service, index) => {

            const Icon = service.icon;

            return (
              <article
                className="service-card"
                key={index}
              >

                <div className="service-icon">
                  <Icon size={19} strokeWidth={1.8} />
                </div>

                <div className="service-content">

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                </div>

              </article>
            );

          })}

        </div>

      </section>


    </main>
  );
}

export default Services;
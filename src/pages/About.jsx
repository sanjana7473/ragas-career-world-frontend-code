import "./About.css";

import founderCeo from "../assets/founder-ceo.png";
import headRecruitment from "../assets/head-of-recruitment.png";
import headCompliance from "../assets/head-of-compliance.png";

const stats = [
  ["2010", "Founded"],
  ["40+", "Industries"],
  ["18", "Countries"],
  ["1000+", "Placements"],
];

const leaders = [
  {
    role: "Founder & CEO",
    text: "Overall strategy & global partnerships",
    image: founderCeo,
  },
  {
    role: "Head of Recruitment",
    text: "International & domestic delivery",
    image: headRecruitment,
  },
  {
    role: "Head of Compliance",
    text: "Visa, documentation & partner verification",
    image: headCompliance,
  },
];

function About() {
  return (
    <main className="about-page">

      <section className="about-main">

        <div className="about-intro">
          <p className="about-eyebrow">OUR STORY</p>

          <h1>About RAGAS CAREER WORLD</h1>

          <p className="about-description">
            RAGAS CAREER WORLD specialises in international and domestic
            recruitment, connecting employers with qualified talent and
            helping job seekers build successful careers through professional,
            end-to-end recruitment services.
          </p>
        </div>

        <div className="about-stats">
          {stats.map(([number, label], index) => (
            <div className="about-stat" key={index}>
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="mission-vision">

          <div className="about-info-card">
            <h3>Mission</h3>

            <p>
              Connect employers with verified talent, and candidates with
              genuine opportunities — quickly, transparently, and accessibly.
            </p>
          </div>

          <div className="about-info-card">
            <h3>Vision</h3>

            <p>
              To be the most trusted recruitment brand across international
              and domestic markets, in every industry we serve.
            </p>
          </div>

        </div>

        <div className="leadership-section">

          <p className="about-eyebrow">LEADERSHIP</p>

          <div className="leadership-grid">

            {leaders.map((leader, index) => (
              <div className="leader-card" key={index}>

                <div className="leader-avatar">
                  <img
                    src={leader.image}
                    alt={leader.role}
                  />
                </div>

                <div className="leader-content">
                  <h3>{leader.role}</h3>
                  <p>{leader.text}</p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default About;
import "./VisaSupport.css";

const supportCards = [
  {
    icon: "♢",
    title: "Work-Permit Assistance",
    text: "Step-by-step guidance on employer sponsorship & permit categories, by country.",
  },
  {
    icon: "▣",
    title: "Documentation Support",
    text: "Checklist-driven help for the paperwork overseas placements require.",
  },
  {
    icon: "◎",
    title: "Country-Specific Guidance",
    text: "Gulf, Europe, Canada & Australia visa pathways explained in plain language.",
  },
];

function VisaSupport() {
  return (
    <main className="visa-page">

      <section className="visa-main">

        <div className="visa-heading">
          <p className="visa-eyebrow">SUPPORTING YOUR MOVE</p>

          <h1>Visa &amp; Immigration Support</h1>
        </div>

        <div className="visa-cards">
          {supportCards.map((card) => (
            <div className="visa-card" key={card.title}>

              <div className="visa-icon">
                {card.icon}
              </div>

              <h3>{card.title}</h3>

              <p>{card.text}</p>

            </div>
          ))}
        </div>

        <div className="visa-faq-section">

          <p className="visa-faq-eyebrow">
            FREQUENTLY ASKED
          </p>

          <div className="visa-faq-box">

            <div className="visa-faq-item">
              <h4>
                Who arranges the visa — RAGAS or the employer?
              </h4>

              <p>
                The employer sponsors the visa; RAGAS coordinates
                documentation and timelines on your behalf.
              </p>
            </div>

            <div className="visa-faq-item">
              <h4>
                How long does the process usually take?
              </h4>

              <p>
                Typically 3–8 weeks depending on destination country
                and role category.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default VisaSupport;
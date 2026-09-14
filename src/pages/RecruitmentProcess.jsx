import "./RecruitmentProcess.css";

const steps = [
  {
    number: "1",
    title: "Sourcing",
    text: "Multi-channel candidate sourcing across our network & database",
  },
  {
    number: "2",
    title: "Screening",
    text: "Skills, background & document verification",
  },
  {
    number: "3",
    title: "Shortlisting",
    text: "Curated shortlist matched to employer requirements",
  },
  {
    number: "4",
    title: "Interview",
    text: "Coordinated interviews — in person, video, or panel",
  },
  {
    number: "5",
    title: "Offer",
    text: "Offer negotiation & documentation support",
  },
  {
    number: "6",
    title: "Onboarding",
    text: "Visa/work-permit assistance & onboarding follow-up",
  },
];

function RecruitmentProcess() {
  return (
    <main className="recruitment-process-page">

      <section className="recruitment-process-main">

        <div className="recruitment-heading">
          <p className="recruitment-eyebrow">
            OUR METHODOLOGY
          </p>

          <h1>Recruitment Process</h1>

          <p>
            From sourcing to onboarding — a consistent, visual timeline
            for employers and candidates alike.
          </p>
        </div>


        <div className="recruitment-timeline">

          <div className="timeline-line"></div>

          {steps.map((step) => (
            <div className="timeline-step" key={step.number}>

              <div className="timeline-number">
                {step.number}
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>

            </div>
          ))}

        </div>


        <div className="screen-reader-note">
          <strong>Screen-reader equivalent:</strong>{" "}
          The same six steps are also presented as an ordered text list
          beneath the visual timeline, so the sequence is never conveyed
          by position alone.
        </div>


        <ol className="accessible-step-list">
          {steps.map((step) => (
            <li key={step.number}>
              <strong>{step.title}</strong> — {step.text}
            </li>
          ))}
        </ol>

      </section>


    </main>
  );
}

export default RecruitmentProcess;
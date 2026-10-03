import { useNavigate } from "react-router-dom";
import "./Employers.css";

const benefits = [
  {
    title: "Verified talent",
    text: "Access qualified professionals aligned with your requirements.",
  },
  {
    title: "Smart hiring",
    text: "Streamline candidate sourcing, screening and selection.",
  },
  {
    title: "Expert support",
    text: "Recruitment support for specialised hiring requirements.",
  },
];

function Employers() {
  const navigate = useNavigate();

  return (
    <main className="emp-page">
      <section className="emp-hero">
        {/* LEFT: message + action */}
        <div className="emp-copy">
          <p className="emp-kicker">For agents</p>

         <h1 className="emp-title">
  <span className="emp-title-green">Hiring that moves</span>
  <span className="emp-title-gold">business forward.</span>
</h1>

          <span className="emp-rule" aria-hidden="true"></span>

          <p className="emp-lead">
            Connect your company with qualified, verified talent.
          </p>

          <button
            type="button"
            className="emp-btn"
            onClick={() => navigate("/employee-login")}
          >
            <span>Login as agent</span>
            <span className="emp-btn-arrow" aria-hidden="true">↗</span>
          </button>
        </div>

        {/* RIGHT: ecosystem panel */}
        <aside className="emp-panel" aria-label="Ragas agents ecosystem">
          <header className="emp-panel-head">
            <span className="emp-panel-brand">Ragas</span>
            <span className="emp-panel-sub">Agents ecosystem</span>
          </header>

          <ul className="emp-list">
            {benefits.map((item, i) => (
              <li className="emp-item" style={{ "--i": i }} key={item.title}>
                <span className="emp-item-mark" aria-hidden="true"></span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <footer className="emp-panel-foot">
            <span>People</span>
            <i aria-hidden="true"></i>
            <span>Business</span>
            <i aria-hidden="true"></i>
            <span>Opportunity</span>
          </footer>
        </aside>
      </section>
    </main>
  );
}

export default Employers;
import { Link } from "react-router-dom";
import { templates } from "../templates";

const features = [
  { icon: "⚡", title: "High-Precision Timing", text: "Stimulus onset synced to the screen paint, reaction times captured with high-resolution timestamps." },
  { icon: "🧩", title: "Visual Experiment Builder", text: "Start from a template or build from scratch. No code needed." },
  { icon: "🔒", title: "Anonymous & Ethical", text: "Random participant IDs, a consent screen, and no personal data stored." },
];

const steps = [
  { n: "1", title: "Create", text: "Pick a template or build your own experiment." },
  { n: "2", title: "Share", text: "Send the participant link to anyone, on any device." },
  { n: "3", title: "Analyze", text: "View results and download the data as CSV." },
];

export default function Landing() {
  return (
    <div>
      <section className="hero">
        <span className="pill">Browser-based behavioral research</span>
        <h1>Run lab-grade experiments in a browser tab.</h1>
        <p className="muted">
          NeuroLab lets researchers build, share and analyze cognitive experiments
          with millisecond timing, no coding required.
        </p>
        <div className="row center-row">
          <Link className="btn primary big" to="/build">Create an Experiment</Link>
          <Link className="btn big" to="/participate">Participate</Link>
        </div>
      </section>

      <h2>Ready-made tests</h2>
      <div className="grid3">
        {templates.map((t) => (
          <div className="card" key={t.id}>
            <div className="icon">{t.icon}</div>
            <h3>{t.name}</h3>
            <p className="muted">Measures {t.measures.toLowerCase()}</p>
            <Link className="btn" to="/build">Use Template</Link>
          </div>
        ))}
      </div>

      <h2>How it works</h2>
      <div className="grid3">
        {steps.map((s) => (
          <div className="card" key={s.n}>
            <div className="stepnum">{s.n}</div>
            <h3>{s.title}</h3>
            <p className="muted">{s.text}</p>
          </div>
        ))}
      </div>

      <h2>Key Features</h2>
      <div className="grid3">
        {features.map((f) => (
          <div className="card" key={f.title}>
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p className="muted">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
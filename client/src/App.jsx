import { useState, useEffect } from "react";
import { Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Participate from "./pages/Participate";
import Run from "./pages/Run";
import ResultsList from "./pages/ResultsList";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const links = [
  { to: "/", label: "Home", icon: "🏠", end: true },
  { to: "/experiments", label: "Experiments", icon: "🧪" },
  { to: "/build", label: "Create Experiment", icon: "➕" },
  { to: "/participate", label: "Participate", icon: "🎯" },
  { to: "/results", label: "Results", icon: "📊" },
];

export default function App() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isParticipant = pathname.startsWith("/run/"); // no header/footer during a test

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="app">
      {!isParticipant && (
        <>
          {/* HEADER */}
          <header className="topbar">
            <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
            <Link to="/" className="brand">🧠 NeuroLab</Link>
            <div className="header-right">
              <Link to="/participate" className="navlink">Participate</Link>
              <Link to="/build" className="btn primary">+ Create</Link>
            </div>
          </header>

          {open && <div className="overlay" onClick={() => setOpen(false)} />}

          {/* SLIDE-OUT MENU */}
          <aside className={`sidebar ${open ? "open" : ""}`}>
            <div className="side-head">
              <span className="brand">🧠 NeuroLab</span>
              <button className="menu-btn" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
            </div>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="side-link">
                <span>{l.icon}</span> {l.label}
              </NavLink>
            ))}
          </aside>
        </>
      )}

      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/experiments" element={<Dashboard />} />
          <Route path="/build" element={<Builder />} />
          <Route path="/participate" element={<Participate />} />
          <Route path="/run/:id" element={<Run />} />
          <Route path="/results" element={<ResultsList />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* FOOTER */}
      {!isParticipant && (
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <div className="brand">🧠 NeuroLab</div>
              <p className="muted small">Browser-based cognitive experiments with millisecond timing.</p>
            </div>
            <div className="footer-links">
              <Link to="/experiments">Experiments</Link>
              <Link to="/build">Create</Link>
              <Link to="/participate">Participate</Link>
              <Link to="/results">Results</Link>
            </div>
          </div>
          <p className="muted small footer-copy">
            © {new Date().getFullYear()} NeuroLab · Participant data is anonymous and stored securely.
          </p>
        </footer>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { api } from "../api";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const norm = (s) => s.replace(/\s+/g, "").toLowerCase();

export default function TrialRunner({ experiment }) {
  const [phase, setPhase] = useState("consent"); // consent | run | done
  const [trials] = useState(() => (experiment.randomize ? shuffle(experiment.trials) : experiment.trials));
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState("fixation"); // fixation | stimulus | recall | blank
  const [answer, setAnswer] = useState("");

  const results = useRef([]);
  const onset = useRef(0);
  const responded = useRef(false);
  const participantId = useRef(crypto.randomUUID());

  const next = () => {
    setStage("blank");
    setTimeout(() => {
      setIndex((i) => i + 1);
      setStage("fixation");
    }, 300);
  };

  const endTrial = (key, rt) => {
    if (responded.current) return;
    responded.current = true;
    const t = trials[index];
    results.current.push({
      trialIndex: index,
      kind: "keypress",
      stimulus: t.stimulus,
      correctKey: t.correctKey,
      keyPressed: key,
      rt: rt == null ? null : Math.round(rt * 100) / 100,
      correct: key === t.correctKey,
    });
    next();
  };

  const submitRecall = () => {
    if (responded.current) return;
    responded.current = true;
    const t = trials[index];
    results.current.push({
      trialIndex: index,
      kind: "recall",
      stimulus: t.stimulus,
      answer,
      rt: null,
      correct: norm(answer) === norm(t.stimulus),
    });
    setAnswer("");
    next();
  };

  useEffect(() => {
    if (phase !== "run" || index >= trials.length) return;
    const t = trials[index];

    if (stage === "fixation") {
      const id = setTimeout(() => setStage("stimulus"), t.fixation);
      return () => clearTimeout(id);
    }

    if (stage === "stimulus") {
      responded.current = false;

      // Memory recall: show items, then switch to the answer box
      if (t.kind === "recall") {
        const id = setTimeout(() => setStage("recall"), t.duration > 0 ? t.duration : 2000);
        return () => clearTimeout(id);
      }

      // Key press: record onset right before the browser paints
      const raf = requestAnimationFrame(() => { onset.current = performance.now(); });

      const onKey = (e) => {
        if (e.repeat || !onset.current) return;
        if (e.key === " ") e.preventDefault();
        endTrial(e.key.toLowerCase(), e.timeStamp - onset.current);
      };
      window.addEventListener("keydown", onKey);

      let timer;
      if (t.duration > 0) timer = setTimeout(() => endTrial(null, null), t.duration);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
        window.removeEventListener("keydown", onKey);
        onset.current = 0;
      };
    }
  }, [phase, index, stage]);

  useEffect(() => {
    if (phase === "run" && index >= trials.length) {
      setPhase("done");
      api.post("/responses", {
        experimentId: experiment._id,
        participantId: participantId.current,
        consent: true,
        trials: results.current,
      });
    }
  }, [index, phase]);

  if (phase === "consent")
    return (
      <div className="card center">
        <h1>{experiment.title}</h1>
        <p>{experiment.description}</p>
        <div className="consent">
          <h3>Consent</h3>
          <p>
            Participation is voluntary. Your responses are stored under a random anonymous ID.
            No name, email, or personal information is collected. You can close this page at any time.
          </p>
        </div>
        <button className="btn primary" onClick={() => setPhase("run")}>I agree, start</button>
      </div>
    );

  if (phase === "done")
    return (
      <div className="card center">
        <h1>Thank you! 🎉</h1>
        <p>Your responses were recorded anonymously.</p>
      </div>
    );

  const current = trials[index];
  return (
    <div className="stage">
      {stage === "fixation" && <span className="stim">+</span>}
      {stage === "stimulus" && current && (
        <span className="stim" style={{ color: current.color || "#fff" }}>{current.stimulus}</span>
      )}
      {stage === "recall" && (
        <div className="center">
          <p>Type what you saw, then press Enter</p>
          <input
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitRecall()}
          />
          <button className="btn primary" onClick={submitRecall}>Submit</button>
        </div>
      )}
      <p className="muted small">Trial {Math.min(index + 1, trials.length)} / {trials.length}</p>
    </div>
  );
}
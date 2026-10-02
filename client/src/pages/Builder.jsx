import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { templates } from "../templates";

const emptyTrial = { kind: "keypress", stimulus: "", color: "#ffffff", correctKey: "f", fixation: 500, duration: 0 };

export default function Builder() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(null); // chosen template
  const [params, setParams] = useState({});
  const [type, setType] = useState("custom");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [randomize, setRandomize] = useState(false);
  const [trials, setTrials] = useState([{ ...emptyTrial }]);

  const pickTemplate = (t) => {
    const p = {};
    t.params.forEach((x) => (p[x.key] = x.value));
    setSelected(t);
    setParams(p);
    setType(t.id);
    setTitle(t.title);
    setDescription(t.description);
    setRandomize(t.randomize);
    setTrials(t.build(p));
  };

  const startBlank = () => {
    setSelected(null);
    setParams({});
    setType("custom");
    setTitle("");
    setDescription("");
    setRandomize(false);
    setTrials([{ ...emptyTrial }]);
  };

  const applyParams = () => {
    const p = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, Number(v)]));
    setTrials(selected.build(p));
  };

  const update = (i, field, value) =>
    setTrials(trials.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  const save = async () => {
    if (!title.trim()) return alert("Give your experiment a title");
    const clean = [];
    for (const t of trials) {
      if (!t.stimulus.trim()) continue;
      let key = t.correctKey.toLowerCase();
      if (key === "space") key = " ";
      if (t.kind === "keypress" && !key) return alert("Every key-press trial needs a correct key");
      clean.push({
        ...t,
        correctKey: t.kind === "recall" ? "" : key,
        fixation: Number(t.fixation),
        duration: Number(t.duration),
      });
    }
    if (clean.length === 0) return alert("Add at least one trial");
    await api.post("/experiments", { title, description, type, randomize, trials: clean });
    nav("/experiments");
  };

  return (
    <div>
      <h1>Create Experiment</h1>

      <h3>1. Start from a template</h3>
      <div className="grid3">
        {templates.map((t) => (
          <div className={`card ${selected?.id === t.id ? "selected" : ""}`} key={t.id}>
            <div className="icon">{t.icon}</div>
            <h3>{t.name}</h3>
            <p className="muted small">Measures {t.measures.toLowerCase()}</p>
            <button className="btn primary" onClick={() => pickTemplate(t)}>Use Template</button>
          </div>
        ))}
        <div className={`card ${!selected ? "selected" : ""}`}>
          <div className="icon">✏️</div>
          <h3>Blank</h3>
          <p className="muted small">Build your own from scratch</p>
          <button className="btn" onClick={startBlank}>Start Blank</button>
        </div>
      </div>

      {selected && (
        <>
          <h3>2. Template parameters</h3>
          <div className="card">
            <div className="grid">
              {selected.params.map((p) => (
                <label key={p.key}>{p.label}
                  <input type="number" value={params[p.key]}
                    onChange={(e) => setParams({ ...params, [p.key]: e.target.value })} />
                </label>
              ))}
            </div>
            <button className="btn" onClick={applyParams}>Regenerate trials</button>
            <p className="muted small">Regenerating replaces the trials below.</p>
          </div>
        </>
      )}

      <h3>{selected ? "3." : "2."} Details</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description / instructions shown to participants" value={description}
        onChange={(e) => setDescription(e.target.value)} />
      <label className="row">
        <input type="checkbox" checked={randomize} onChange={(e) => setRandomize(e.target.checked)} />
        Randomize trial order
      </label>

      <h3>{selected ? "4." : "3."} Trials ({trials.length})</h3>
      {trials.map((t, i) => (
        <div className="card" key={i}>
          <div className="grid">
            <label>Type
              <select value={t.kind} onChange={(e) => update(i, "kind", e.target.value)}>
                <option value="keypress">Key press</option>
                <option value="recall">Memory recall</option>
              </select>
            </label>
            <label>{t.kind === "recall" ? "Items to remember (space-separated)" : "Stimulus (text/emoji)"}
              <input value={t.stimulus} onChange={(e) => update(i, "stimulus", e.target.value)} />
            </label>
            {t.kind === "keypress" && (
              <>
                <label>Colour
                  <input type="color" value={t.color} onChange={(e) => update(i, "color", e.target.value)} />
                </label>
                <label>Correct key (type "space" for spacebar)
                  <input value={t.correctKey === " " ? "space" : t.correctKey}
                    onChange={(e) => update(i, "correctKey", e.target.value)} />
                </label>
              </>
            )}
            <label>Fixation (ms)
              <input type="number" value={t.fixation} onChange={(e) => update(i, "fixation", e.target.value)} />
            </label>
            <label>{t.kind === "recall" ? "Show for (ms)" : "Time limit (ms, 0 = until key)"}
              <input type="number" value={t.duration} onChange={(e) => update(i, "duration", e.target.value)} />
            </label>
          </div>
          {trials.length > 1 && (
            <button className="btn danger" onClick={() => setTrials(trials.filter((_, x) => x !== i))}>
              Remove
            </button>
          )}
        </div>
      ))}
      <div className="row">
        <button className="btn" onClick={() => setTrials([...trials, { ...emptyTrial }])}>+ Add Trial</button>
        <button className="btn primary" onClick={save}>Save Experiment</button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const [experiments, setExperiments] = useState([]);

  const load = () => api.get("/experiments").then(setExperiments);
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this experiment?")) return;
    await api.del(`/experiments/${id}`);
    load();
  };

  const copyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/run/${id}`);
    alert("Participant link copied!");
  };

  return (
    <div>
      <h1>Experiments</h1>
      <p className="muted">Build, share a link, collect millisecond-accurate data.</p>
      {experiments.length === 0 && (
        <p>No experiments yet. <Link to="/build">Create one!</Link></p>
      )}
      {experiments.map((e) => (
        <div className="card" key={e._id}>
          <h3>{e.title} <span className="badge">{e.type}</span></h3>
          <p className="muted">{e.description || "No description"} · {e.trials.length} trials</p>
          <div className="row">
            <Link className="btn" to={`/run/${e._id}`}>Preview</Link>
            <button className="btn" onClick={() => copyLink(e._id)}>Copy Link</button>
            <Link className="btn" to={`/results/${e._id}`}>Results</Link>
            <button className="btn danger" onClick={() => remove(e._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
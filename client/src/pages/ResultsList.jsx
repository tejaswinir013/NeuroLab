import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function ResultsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const exps = await api.get("/experiments");
      const withCounts = await Promise.all(
        exps.map(async (e) => {
          const r = await api.get(`/responses/${e._id}`);
          return { ...e, participants: r.length };
        })
      );
      setRows(withCounts);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1>Results</h1>
      <p className="muted">Pick an experiment to see its data.</p>
      {loading && <p>Loading…</p>}
      {!loading && rows.length === 0 && <p>No experiments yet.</p>}
      {rows.map((e) => (
        <div className="card" key={e._id}>
          <h3>{e.title} <span className="badge">{e.type}</span></h3>
          <p className="muted">{e.participants} participant{e.participants === 1 ? "" : "s"} · {e.trials.length} trials</p>
          <Link className="btn primary" to={`/results/${e._id}`}>View Results</Link>
        </div>
      ))}
    </div>
  );
}
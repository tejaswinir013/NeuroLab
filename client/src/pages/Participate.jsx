import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Participate() {
  const [list, setList] = useState([]);

  useEffect(() => { api.get("/experiments").then(setList); }, []);

  return (
    <div>
      <h1>Participate</h1>
      <p className="muted">Pick a study to take part in. Responses are anonymous.</p>
      {list.length === 0 && <p>No studies available yet.</p>}
      {list.map((e) => (
        <div className="card" key={e._id}>
          <h3>{e.title} <span className="badge">{e.type}</span></h3>
          <p className="muted">{e.description || "No description"}</p>
          <p className="muted small">{e.trials.length} trials</p>
          <Link className="btn primary" to={`/run/${e._id}`}>Start</Link>
        </div>
      ))}
    </div>
  );
}
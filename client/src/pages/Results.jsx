import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, API_BASE } from "../api";

export default function Results() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/responses/${id}`)
      .then((data) => {
        if (Array.isArray(data)) setResponses(data);
        else setError("Could not load results.");
      })
      .catch(() => setError("Could not reach the server. Is it running?"))
      .finally(() => setLoading(false));
  }, [id]);

  const allTrials = responses.flatMap((r) => r.trials || []);
  const withRt = allTrials.filter((t) => t.rt != null);
  const meanRt = withRt.length ? (withRt.reduce((s, t) => s + t.rt, 0) / withRt.length).toFixed(1) : "-";
  const accuracy = allTrials.length
    ? ((allTrials.filter((t) => t.correct).length / allTrials.length) * 100).toFixed(1)
    : "-";

  const show = (t) =>
    t.kind === "recall" ? t.answer || "—" : t.keyPressed === " " ? "space" : t.keyPressed ?? "—";

  if (loading) return <p>Loading…</p>;
  if (error) return (
    <div>
      <Link to="/results">← Back to results</Link>
      <p>{error}</p>
    </div>
  );

  return (
    <div>
      <Link to="/results" className="muted">← Back to results</Link>
      <h1>Results</h1>
      <div className="row">
        <div className="card stat"><h2>{responses.length}</h2><p>Participants</p></div>
        <div className="card stat"><h2>{meanRt} ms</h2><p>Mean RT</p></div>
        <div className="card stat"><h2>{accuracy}%</h2><p>Accuracy</p></div>
      </div>

      {responses.length === 0 ? (
        <p className="muted">No responses yet. Go to Participate and complete the test once.</p>
      ) : (
        <>
          <a className="btn primary" href={`/api/responses/${id}/csv`}>⬇ Download CSV</a>
          <table>
            <thead>
              <tr><th>Participant</th><th>Trial</th><th>Stimulus</th><th>Response</th><th>RT (ms)</th><th>Correct</th></tr>
            </thead>
            <tbody>
              {responses.flatMap((r) =>
                (r.trials || []).map((t, i) => (
                  <tr key={r._id + i}>
                    <td>{String(r.participantId).slice(0, 8)}</td>
                    <td>{t.trialIndex + 1}</td>
                    <td>{t.stimulus}</td>
                    <td>{show(t)}</td>
                    <td>{t.rt ?? "—"}</td>
                    <td>{t.correct ? "✅" : "❌"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
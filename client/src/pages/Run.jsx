import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import TrialRunner from "../components/TrialRunner";

export default function Run() {
  const { id } = useParams();
  const [experiment, setExperiment] = useState(null);

  useEffect(() => { api.get(`/experiments/${id}`).then(setExperiment); }, [id]);

  if (!experiment) return <p>Loading…</p>;
  if (experiment.error) return <p>Experiment not found.</p>;
  return <TrialRunner experiment={experiment} />;
}
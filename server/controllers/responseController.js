const Response = require("../models/Response");

exports.saveResponse = async (req, res) => {
  try {
    if (!req.body.consent) return res.status(400).json({ error: "Consent required" });
    const r = await Response.create(req.body);
    res.status(201).json({ id: r._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getResponses = async (req, res) => {
  const list = await Response.find({ experimentId: req.params.experimentId });
  res.json(list);
};

exports.exportCsv = async (req, res) => {
  const list = await Response.find({ experimentId: req.params.experimentId });
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = ["participantId,trialIndex,kind,stimulus,correctKey,keyPressed,answer,rt,correct"];
  list.forEach((r) =>
    r.trials.forEach((t) =>
      rows.push(
        [r.participantId, t.trialIndex, t.kind, q(t.stimulus), q(t.correctKey), q(t.keyPressed), q(t.answer), t.rt ?? "", t.correct].join(",")
      )
    )
  );
  res.header("Content-Type", "text/csv");
  res.attachment("NeuroLab-results.csv");
  res.send(rows.join("\n"));
};
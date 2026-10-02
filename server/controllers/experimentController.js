const Experiment = require("../models/Experiment");

exports.createExperiment = async (req, res) => {
  try {
    const exp = await Experiment.create(req.body);
    res.status(201).json(exp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExperiments = async (req, res) => {
  const list = await Experiment.find().sort({ createdAt: -1 });
  res.json(list);
};

exports.getExperiment = async (req, res) => {
  try {
    const exp = await Experiment.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: "Not found" });
    res.json(exp);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
};

exports.deleteExperiment = async (req, res) => {
  await Experiment.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
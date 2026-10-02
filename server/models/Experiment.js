const mongoose = require("mongoose");

const trialSchema = new mongoose.Schema({
  kind: { type: String, enum: ["keypress", "recall"], default: "keypress" },
  stimulus: { type: String, required: true },     // text shown, or items to remember
  color: { type: String, default: "#ffffff" },    // ink colour (Stroop)
  correctKey: { type: String, default: "" },      // keypress trials only
  fixation: { type: Number, default: 500 },       // ms of "+" before stimulus
  duration: { type: Number, default: 0 },         // ms shown / time limit (0 = until key)
});

const experimentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, default: "custom" },    // stroop | reaction | memory | custom
    randomize: { type: Boolean, default: false },
    trials: [trialSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experiment", experimentSchema);
const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    experimentId: { type: mongoose.Schema.Types.ObjectId, ref: "Experiment", required: true },
    participantId: { type: String, required: true },
    consent: { type: Boolean, required: true },
    trials: [
      {
        trialIndex: Number,
        kind: String,
        stimulus: String,
        correctKey: String,
        keyPressed: String,
        answer: String,   // recall trials
        rt: Number,       // ms, null if no response
        correct: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Response", responseSchema);
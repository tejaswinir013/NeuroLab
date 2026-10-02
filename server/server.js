require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/experiments", require("./routes/experimentRoutes"));
app.use("/api/responses", require("./routes/responseRoutes"));

app.get("/", (req, res) => res.send("NeuroLab API running"));

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server on port ${process.env.PORT || 5000}`)
  );
});
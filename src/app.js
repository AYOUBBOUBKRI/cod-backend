const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" })); // مؤقتاً، من بعد نحدّدو domains
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API Running 🚀" }));

app.use("/api", require("./routes"));

// Error fallback
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

module.exports = app;

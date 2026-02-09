const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

// ✅ Mount routes (اختيار 1: مباشرة)
const routes = require("./routes");
app.use("/", routes);

// (اختيار 2 أحسن: تخليهم تحت /api)
// app.use("/api", routes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on", PORT));

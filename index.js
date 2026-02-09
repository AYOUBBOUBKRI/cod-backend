const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// Root route (simple ping)
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

// ✅ Mount API routes تحت /api
const routes = require("./routes");
app.use("/api", routes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on", PORT));

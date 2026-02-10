// src/app.js
const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

// Mount API routes
app.use("/api", routes);

module.exports = app;

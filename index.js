const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// 🔹 Test Route
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

// 🔹 Test DB Connection Route
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database connection failed ❌" });
    } else {
      res.json({ message: "Database Connected Successfully ✅" });
    }
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

async function getDb() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
  });
}

app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

app.get("/test-db", async (req, res) => {
  try {
    const db = await getDb();
    const [rows] = await db.query("SELECT 1 AS test");
    await db.end();
    res.json({ success: true, db: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

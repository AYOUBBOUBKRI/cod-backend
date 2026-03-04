const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ CORS
app.use(cors());

// ✅ Body parser
app.use(express.json());

// ✅ Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ✅ ROUTES (خاصها تجي قبل 404)
const routes = require("./routes");
app.use("/api", routes);

// ✅ 404 handler (خاصو يجي بعد routes)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not Found" });
});

// ✅ error handler (آخر واحد)
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
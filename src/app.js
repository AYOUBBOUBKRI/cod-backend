const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ CORS (حالياً مفتوح، فـ production نحدوه بالدومين)
app.use(cors());

// ✅ Body parser
app.use(express.json());

// ✅ Basic rate limiting (يحميك من spam/bruteforce)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200, // 200 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// routes
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not Found" });
});

const routes = require("./routes");
app.use("/api", routes);

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
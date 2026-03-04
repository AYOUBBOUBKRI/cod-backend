const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ CORS

const allowedOrigins = [
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // ✅ Thunder/Postman/server-to-server: no origin
      if (!origin) return cb(null, true);

      // ✅ إذا FRONTEND_URL ما متعيّنش: نخليها مفتوحة (dev fallback)
      if (allowedOrigins.length === 0) return cb(null, true);

      // ✅ allow only frontend domain
      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error("CORS blocked"), false);
    },
    credentials: true,
  })
);

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
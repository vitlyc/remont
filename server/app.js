// app.js — минимально и стабильно для Express 5
require("dotenv").config(); // 1) грузим .env как можно раньше

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// helpers
const toArray = (v, fallback = []) =>
  String(v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) || fallback;

const toBool = (v, d = false) => {
  if (typeof v === "boolean") return v;
  if (v == null) return d;
  return String(v).trim().toLowerCase() === "true";
};

// CORS allowlist из .env
const allowList = toArray(process.env.CORS_ORIGIN); // "https://front.vercel.app,http://localhost:5173"

// CORS options — без app.options('*') / '/(.*)'
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowList.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: toBool(process.env.CORS_CREDENTIALS, true),
  methods: toArray(process.env.CORS_METHODS) || [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: toArray(process.env.CORS_ALLOWED_HEADERS) || [
    "Content-Type",
    "Authorization",
  ],
};

const app = express();

app.set("trust proxy", 1); // за прокси (Render) — важно для secure cookie

// базовые миддлвары
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ГЛОБАЛЬНЫЙ CORS ДО роутов — этого достаточно, он обработает и OPTIONS
app.use(cors(corsOptions));

// роуты
app.use("/api/v1/users", require("./routes/users"));

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// error handler (в т.ч. для CORS-ошибок)
app.use((err, req, res, next) => {
  console.error(err);
  const status = /CORS/i.test(String(err?.message)) ? 403 : 500;
  res.status(status).json({ error: err?.message || "Internal error" });
});

// запуск
const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error("MONGO_URL is required");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() =>
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
  )
  .catch((e) => {
    console.error("Mongo connect error", e);
    process.exit(1);
  });

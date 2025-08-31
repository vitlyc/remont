// app.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// env
dotenv.config();

const app = express();

/* =====================  C O R S  ===================== */
const allowedOrigin = [
  "https://remont-mu.vercel.app",
  "http://http://localhost:5173",
];

// Настройка CORS для разрешения кросс-доменных запросов с куки
app.use(
  cors({
    origin: allowedOrigin, // Указываем точный домен, с которого разрешён доступ
    methods: ["GET", "POST", "PUT", "DELETE"], // Разрешаем методы
    allowedHeaders: ["Content-Type", "Authorization"], // Разрешаем заголовки
    credentials: true, // Разрешаем использование cookies и других credentials
  })
);

/* =====================  M I D D L E W A R E S  ===================== */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("common"));

/* =====================  R O U T E S  ===================== */
const usersRouter = require("./routes/users");
const casesRouter = require("./routes/cases");

// OAuth роутеры (экспортируются как объект)
const {
  apiRouter: googleApiRouter,
  rootRouter: googleRootRouter,
} = require("./routes/googleOauth");

// Колбэк должен совпадать с редиректом в Google Console: /auth/google/callback
app.use("/", googleRootRouter);

// Остальные API
app.use("/api/v1", googleApiRouter); // /api/v1/auth/google
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/cases", casesRouter);

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// error handler (должен быть последним)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal error" });
});

/* =====================  S T A R T  ===================== */
const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("MONGO_URL is required");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Mongo connect error", e);
    process.exit(1);
  });

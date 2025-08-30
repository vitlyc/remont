const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

dotenv.config({ quiet: true });

const app = express();

const allowedOrigin = [
  "https://remont-mu.vercel.app,http://localhost:5173",
  "http://localhost:5173",
]; // Укажите ваш домен

// Настройка CORS для разрешения кросс-доменных запросов с куки
app.use(
  cors({
    origin: allowedOrigin, // Указываем точный домен, с которого разрешён доступ
    methods: ["GET", "POST", "PUT", "DELETE"], // Разрешаем методы
    allowedHeaders: ["Content-Type", "Authorization"], // Разрешаем заголовки
    credentials: true, // Разрешаем использование cookies и других credentials
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("common"));

// routes
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/cases", require("./routes/cases"));
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal error" });
});

const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("MONGO_URL is required");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    app.listen(PORT);
  })
  .catch((e) => {
    console.error("Mongo connect error", e);
    process.exit(1);
  });

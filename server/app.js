const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

dotenv.config({ quiet: true });
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: process.env.CORS_CREDENTIALS === "true",
  methods: process.env.CORS_METHODS?.split(",") || ["GET", "POST"],
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(",") || [
    "Content-Type",
    "Authorization",
  ],
};

const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("common"));

app.use(cors(corsOptions));

// routes
app.use("/api/v1/users", require("./routes/users"));

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
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Mongo connect error", e);
    process.exit(1);
  });

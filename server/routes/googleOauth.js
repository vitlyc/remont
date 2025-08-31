// routes/googleOauth.js
const express = require("express");
const { google } = require("googleapis");
const User = require("../models/user");

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
];

function makeOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// Роутер для /api/v1/*
const apiRouter = express.Router();

apiRouter.get("/auth/google", (req, res) => {
  const oAuth2Client = makeOAuth2Client();
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
  res.redirect(url);
});

// Роутер для корневого колбэка /auth/google/callback
const rootRouter = express.Router();

// routes/googleOauth.js (фрагмент)
rootRouter.get("/auth/google/callback", async (req, res, next) => {
  try {
    const userId = req.cookies?.uid;
    if (!userId) return res.status(401).send("User not authenticated");

    const { code } = req.query;
    const oAuth2Client = makeOAuth2Client();
    const { tokens } = await oAuth2Client.getToken(code);

    await User.findByIdAndUpdate(userId, {
      $set: { "google.tokens": tokens, "google.connectedAt": new Date() },
    });

    const redirectTo = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/?google=connected`;
    return res.redirect(redirectTo);
  } catch (err) {
    next(err);
  }
});

module.exports = { apiRouter, rootRouter, makeOAuth2Client };

// controllers/google.js
const googleapis = require("googleapis");
const User = require("../models/user");

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
];

function makeOAuth2Client() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
    process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error(
      "Google OAuth env vars are missing (GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI)"
    );
  }
  return new googleapis.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

// GET /api/v1/auth/google
async function authGoogle(req, res, next) {
  try {
    const oAuth2Client = makeOAuth2Client();
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
    });
    return res.redirect(url);
  } catch (err) {
    next(err);
  }
}

// GET /auth/google/callback
async function googleCallback(req, res, next) {
  try {
    const userId = req.cookies?.uid;
    if (!userId) return res.status(401).send("User not authenticated");

    const code = req.query.code;
    if (!code) return res.status(400).send("Missing 'code'");

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
}

module.exports = {
  authGoogle,
  googleCallback,
  makeOAuth2Client, // экспорт на случай, если пригодится в других сервисах
};

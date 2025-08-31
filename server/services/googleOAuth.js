// services/googleOAuth.js
const { google } = require("googleapis");

function getOAuth2() {
  const oAuth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return oAuth2;
}

function getDrive() {
  return google.drive({ version: "v3", auth: getOAuth2() });
}

function getDocs() {
  return google.docs({ version: "v1", auth: getOAuth2() });
}

module.exports = { getDrive, getDocs };

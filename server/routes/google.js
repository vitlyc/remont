// routes/google.js
const express = require("express");
const router = express.Router();
const { authGoogle, googleCallback } = require("../controllers/google");

router.get("/api/v1/auth/google", authGoogle);
router.get("/auth/google/callback", googleCallback);

module.exports = router;

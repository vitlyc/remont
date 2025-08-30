const express = require("express");
const router = express.Router();
const { createCase, getUserCases } = require("../controllers/cases");

router.post("/createCase", createCase);
router.get("/getUserCases", getUserCases);

module.exports = router;

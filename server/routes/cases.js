const express = require("express");
const router = express.Router();
const { createCase } = require("../controllers/cases");

router.post("/createCase", createCase);

module.exports = router;

const express = require("express");
const router = express.Router();
const { createDocument } = require("../controllers/documents");

// POST /api/v1/documents/createDocument
router.post("/createDocument", createDocument);

module.exports = router;

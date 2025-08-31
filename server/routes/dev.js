// routes/dev.js (опционально)
const router = require("express").Router();
const { createCaseDocs } = require("../services/caseDocService");

router.post("/api/v1/dev/test-doc", async (req, res, next) => {
  try {
    const info = await createCaseDocs(req.body || {});
    res.json(info);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

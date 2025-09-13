const { createCaseDocs } = require("../services/caseDocService");
const Case = require("../models/case");

exports.createDocument = async (req, res, next) => {
  try {
    const { caseId } = req.body || {};
    if (!caseId) return res.status(400).json({ error: "caseId is required" });
    console.log(caseId);

    const caseDoc = await Case.findById(caseId).lean();
    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found" });
    }

    const result = await createCaseDocs(caseDoc);
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

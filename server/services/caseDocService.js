// services/caseDocService.js
const { getDrive, getDocs } = require("./googleOAuth");

// Форматтеры
const fmtDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("ru-RU");
};
const fmtNum = (n) => {
  if (n === "" || n == null) return "";
  const x = Number(n);
  return Number.isFinite(x) ? x.toLocaleString("ru-RU") : "";
};
const getDef = (arr = [], i = 0, key) => {
  const d = Array.isArray(arr) ? arr[i] : null;
  if (!d) return "";
  if (key === "birthday") return fmtDate(d.birthday);
  return d[key] ?? "";
};

async function createCaseDocs(caseDoc = {}) {
  const templateId = process.env.GOOGLE_TEMPLATE_DOC_ID;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!templateId) throw new Error("GOOGLE_TEMPLATE_DOC_ID is not set");
  if (!folderId) throw new Error("GOOGLE_DRIVE_FOLDER_ID is not set");

  const drive = getDrive();
  const docs = getDocs();

  // 1) копируем шаблон в целевую папку
  const title = `Судебный приказ ${caseDoc?.object?.account}`;

  const { data: copy } = await drive.files.copy({
    fileId: templateId,
    requestBody: { name: title, parents: [folderId] },
    fields: "id, name, webViewLink",
    supportsAllDrives: true,
  });
  const documentId = copy.id;

  // 2) точная карта замен — РОВНО как в шаблоне
  const c = caseDoc;

  const replaceMap = {
    // Суд
    "court.name": c.court?.name ?? "",
    "court.address": c.court?.address ?? "",

    // Объект (используй в шаблоне именно такие ключи)
    "object.account": c.object?.account ?? "",
    "object.area": c.object?.area ?? "",
    "object.address": c.object?.address ?? "", // <-- если в БД поле objectAddress, поменяй шаблон на object.objectAddress ИЛИ БД на address

    // Ответчик №0 (строго defendant, как в шаблоне)
    "defendant[0].surname": getDef(c.defendants, 0, "surname"),
    "defendant[0].name": getDef(c.defendants, 0, "name"),
    "defendant[0].patronymic": getDef(c.defendants, 0, "patronymic"),
    "defendant[0].birthday": getDef(c.defendants, 0, "birthday"),
    "defendant[0].address": getDef(c.defendants, 0, "address"),
    "defendant[0].share": getDef(c.defendants, 0, "share"),
    "defendant[0].passport": getDef(c.defendants, 0, "passport"),

    // Долги
    "debt.total": fmtNum(c.debt?.total),
    "debt.duty": fmtNum(c.debt?.duty),
    "debt.principal": fmtNum(c.debt?.principal),
    "debt.penalty": fmtNum(c.debt?.penalty),

    // Период (исправленный ключ to)
    "debt.period.from": fmtDate(c.debt?.period?.from),
    "debt.period.to": fmtDate(c.debt?.period?.to),
  };

  // 3) replaceAllText для каждого {{ключа}}
  const requests = Object.entries(replaceMap).map(([key, val]) => ({
    replaceAllText: {
      containsText: { text: `{{${key}}}`, matchCase: false },
      replaceText: String(val ?? ""),
    },
  }));

  if (requests.length) {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });
  }

  return {
    docId: documentId,
    name: copy.name,
    docUrl: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

module.exports = { createCaseDocs };

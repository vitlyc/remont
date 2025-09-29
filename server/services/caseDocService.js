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

async function findOrCreateFolder(folderName, parentFolderId) {
  const drive = getDrive();

  // Попытка найти папку с нужным именем в указанной родительской папке
  const response = await drive.files.list({
    q: `'${parentFolderId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`,
    fields: "files(id, name)",
    supportsAllDrives: true,
  });

  const existingFolder = response.data.files.find((file) => file.name === folderName);

  if (existingFolder) {
    return existingFolder.id; // Если папка существует, возвращаем её ID
  }

  // Если папка не найдена, создаем новую в указанной родительской папке
  const { data: newFolder } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId], // Родительская папка
    },
    fields: "id",
    supportsAllDrives: true,
  });

  return newFolder.id; // Возвращаем ID новой папки
}

async function createCaseDocs(caseDoc = {}) {
  const templateId = process.env.GOOGLE_TEMPLATE_DOC_ID;
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // ID родительской папки
  if (!templateId) throw new Error("GOOGLE_TEMPLATE_DOC_ID is not set");
  if (!parentFolderId) throw new Error("GOOGLE_DRIVE_FOLDER_ID is not set");

  const drive = getDrive();
  const docs = getDocs();

  // 1) Получаем данные о фамилии, имени и отчестве ответчика
  const defendantName = `${getDef(caseDoc.defendants, 0, "surname")} ${getDef(caseDoc.defendants, 0, "name")} ${getDef(caseDoc.defendants, 0, "patronymic")}`;

  // 2) Проверяем наличие папки с таким названием в родительской папке
  const folderName = `Судебный приказ - ${defendantName}`;
  const targetFolderId = await findOrCreateFolder(folderName, parentFolderId);

  const title = `Судебный приказ ${caseDoc?.object?.account}`;

  // 3) Копируем шаблон в найденную или созданную папку
  const { data: copy } = await drive.files.copy({
    fileId: templateId,
    requestBody: { name: title, parents: [targetFolderId] },
    fields: "id, name, webViewLink",
    supportsAllDrives: true,
  });
  const documentId = copy.id;

  // 4) Точная карта замен — РОВНО как в шаблоне
  const c = caseDoc;

  const replaceMap = {
    // Суд
    "court.name": c.court?.name ?? "",
    "court.address": c.court?.address ?? "",

    // Объект
    "object.account": c.object?.account ?? "",
    "object.area": c.object?.area ?? "",
    "object.address": c.object?.address ?? "",

    // Ответчик
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

    // Период
    "debt.period.from": fmtDate(c.debt?.period?.from),
    "debt.period.to": fmtDate(c.debt?.period?.to),
  };

  // 5) Заменяем текст в документе
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

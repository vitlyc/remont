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

// Ответчик
const getDef = (arr = [], i = 0, key) => {
  const d = Array.isArray(arr) ? arr[i] : null;
  if (!d) return "";
  if (key === "birthday") return fmtDate(d.birthday);
  return d[key] ?? "";
};

async function findOrCreateFolder(folderName, parentFolderId) {
  const drive = getDrive();

  // Попытка найти папку с нужным именем в родительской папке (parentFolderId)
  const response = await drive.files.list({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed = false`, // добавлено условие trashed = false
    fields: "files(id, name)",
  });

  const existingFolder = response.data.files.find((file) => file.name === folderName);

  if (existingFolder) {
    return existingFolder.id; // Если папка существует, возвращаем её ID
  }

  // Если папка не найдена, создаем новую в родительской папке
  const { data: newFolder } = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId], // Папка внутри parentFolderId
    },
    fields: "id",
  });

  return newFolder.id; // Возвращаем ID новой папки
}

async function createCaseDocs(caseDoc = {}) {
  const templateId = process.env.GOOGLE_TEMPLATE_DOC_ID;
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // Используем родительскую папку для создания

  if (!templateId) throw new Error("GOOGLE_TEMPLATE_DOC_ID is not set");

  const drive = getDrive();
  const docs = getDocs();

  // 1) Получаем данные о фамилии, имени и отчестве ответчика
  const defendantName = `${getDef(caseDoc.defendants, 0, "surname")} ${getDef(caseDoc.defendants, 0, "name")} ${getDef(caseDoc.defendants, 0, "patronymic")}`;

  // 2) Проверяем наличие папки с таким названием в родительской папке
  const folderName = `${defendantName} - Судебный приказ`;
  const targetFolderId = await findOrCreateFolder(folderName, parentFolderId);

  const title = `Судебный приказ - ${caseDoc?.object?.account}`;

  // 3) Копируем шаблон в найденную или созданную папку
  const { data: copy } = await drive.files.copy({
    fileId: templateId,
    requestBody: { name: title, parents: [targetFolderId] }, // Указываем папку, в которой будет создан новый файл
    fields: "id, name, webViewLink",
  });
  const documentId = copy.id;

  // 4) Точная карта замен — РОВНО как в шаблоне
  const c = caseDoc;

  const replaceMap = {
    // Суд
    "Наименование суда": c.court?.name ?? "",
    "Адрес суда": c.court?.address ?? "",

    // Объект
    "ЛС": c.object?.account ?? "",
    "Площадь": c.object?.area ?? "",
    "Адрес объекта": c.object?.objectAddress ?? "",

    // Ответчик
    "ФИО": `${getDef(c.defendants, 0, "surname")} ${getDef(c.defendants, 0, "name")} ${getDef(c.defendants, 0, "patronymic")}`,
    "Дата рождения": getDef(c.defendants, 0, "birthday"),
    "Паспорт": getDef(c.defendants, 0, "passport"),
    "Адрес регистрации": getDef(c.defendants, 0, "address"),
    "Собственность": c.defendants[0].share == 1
      ? "собственности"
      : `долевой собственности (${c.defendants[0].share})`,

    // Долги
    "Цена иска": fmtNum(c.debt?.total),
    "Основной долг": fmtNum(c.debt?.principal),
    "Пени": fmtNum(c.debt?.penalty),
    "Госпошлина": fmtNum(c.debt?.duty),

    // Период
    "Период взыскания": `с ${fmtDate(c.debt?.period?.from)} по ${fmtDate(c.debt?.period?.to)}`
  };

  // 5) Заменяем текст в документе
  const requests = Object.entries(replaceMap).map(([key, val]) => ({
    replaceAllText: {
      containsText: {
        text: `{{${key}}}`, // Обратите внимание на точное соответствие с шаблоном
        matchCase: false
      },
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

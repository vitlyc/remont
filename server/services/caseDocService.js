// services/caseDocService.js
const { getDrive, getDocs } = require("./googleOAuth");

async function createCaseDocs(caseData = {}) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) throw new Error("GOOGLE_DRIVE_FOLDER_ID is not set");

  const drive = getDrive();
  const docs = getDocs();

  // имя для видимости
  const title = `Test ${caseData?.object?.account || Date.now()}`;

  // 1) создаём пустой Google Doc сразу в папке
  const { data: file } = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [folderId],
    },
    fields: "id, name, webViewLink",
    supportsAllDrives: true,
  });

  const documentId = file.id;

  // 2) кидаем одну строку текста, чтобы убедиться, что пишем
  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: `Hello from server! account=${
              caseData?.object?.account || ""
            }\n`,
          },
        },
      ],
    },
  });

  return {
    docId: documentId,
    name: file.name,
    docUrl: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

module.exports = { createCaseDocs };

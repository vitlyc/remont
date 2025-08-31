// services/userDriveDocs.js
const { google } = require("googleapis");
const User = require("../models/user");
const { makeOAuth2Client } = require("../routes/googleOauth");

function buildText(caseData) {
  const o = caseData?.object || {};
  const d = caseData?.debt || {};
  const p = d?.period || {};
  const c = caseData?.court || {};
  const lines = [
    `Лицевой счёт: ${o.account || ""}`,
    `Адрес объекта: ${o.objectAddress || ""}`,
    `Площадь: ${o.area || ""}`,
    ``,
    `Ответчики:`,
    ...(caseData?.defendants || []).map(
      (x, i) =>
        `${i + 1}. ${
          [x.surname, x.name, x.patronymic].filter(Boolean).join(" ") || "-"
        }; ` +
        `Дата рождения: ${x.birthday || "-"}; Паспорт: ${
          x.passport || "-"
        }; Адрес: ${x.address || "-"}; Доля: ${x.share || "-"}`
    ),
    ``,
    `Долг: осн. ${d.principal || 0}, пени ${d.penalty || 0}, всего ${
      d.total || 0
    }, госпошлина ${d.duty || 0}.`,
    `Период: с ${p.from || "-"} по ${p.to || "-"}`,
    ``,
    `Суд: ${c.name || "-"}; адрес: ${c.address || "-"}`,
    `Даты: должнику ${c.dateSentToDebtor || "-"}, в суд ${
      c.dateSentToCourt || "-"
    }, принято ${c.dateAcceptedForReview || "-"}, решение ${
      c.dateDecisionMade || "-"
    }`,
    ``,
    `Комментарии: ${caseData?.comments || "-"}`,
  ];
  return lines.join("\n");
}

async function withUserAuth(userId) {
  const user = await User.findById(userId);
  const tokens = user?.google?.tokens;
  if (!tokens) throw new Error("Google not connected");

  const oAuth2Client = makeOAuth2Client();
  oAuth2Client.setCredentials(tokens);

  // авто-сохранение обновлённых токенов
  oAuth2Client.on("tokens", async (newTokens) => {
    if (newTokens?.access_token || newTokens?.refresh_token) {
      await User.findByIdAndUpdate(userId, {
        $set: { "google.tokens": { ...tokens, ...newTokens } },
      });
    }
  });

  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  const docs = google.docs({ version: "v1", auth: oAuth2Client });
  return { drive, docs };
}

async function createDocForUser(userId, caseData, parentFolderId) {
  const { drive, docs } = await withUserAuth(userId);

  // 1) создаём пустой Google Doc
  const name =
    `Заявление ${caseData?.object?.account || ""}`.trim() || "Заявление";
  const parents = parentFolderId ? [parentFolderId] : undefined;

  const created = await drive.files.create({
    resource: {
      name,
      mimeType: "application/vnd.google-apps.document",
      parents,
    },
    fields: "id, name, webViewLink, parents",
  });

  const docId = created.data.id;

  // 2) вставляем текст
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        { insertText: { location: { index: 1 }, text: buildText(caseData) } },
      ],
    },
  });

  return {
    docId,
    link: `https://docs.google.com/document/d/${docId}/edit`,
    name: created.data.name,
  };
}

module.exports = { createDocForUser };

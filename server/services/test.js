const { getDrive } = require("./googleOAuth");

async function listFiles() {
  try {
    // Получаем сервис Google Drive
    const driveService = getDrive();

    // Запрашиваем список файлов в Google Drive
    const res = await driveService.files.list({
      pageSize: 10, // Количество файлов на странице (можно изменить)
      fields: "nextPageToken, files(id, name, mimeType)", // Указываем, какие поля хотим получить
    });
    console.log(res);

    const files = res.data.files;
    if (files.length) {
      console.log("Список файлов:");
      files.forEach((file) => {
        console.log(`${file.name} (${file.id}) - Тип: ${file.mimeType}`);
      });
    } else {
      console.log("Нет доступных файлов.");
    }
  } catch (error) {
    console.error("Ошибка при получении списка файлов:", error);
  }
}
module.exports = { listFiles };

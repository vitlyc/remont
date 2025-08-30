export function getLastDayOfPreviousMonth() {
  const today = new Date();
  today.setMonth(today.getMonth() - 1); // Переходим к предыдущему месяцу
  today.setDate(0); // Устанавливаем последний день этого месяца
  return today.toISOString().split("T")[0]; // Возвращаем в формате YYYY-MM-DD
}

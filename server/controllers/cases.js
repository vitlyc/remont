// controllers/cases.js
const Case = require("../models/case");
const User = require("../models/user");

// Функция для создания нового дела
const createCase = async (req, res) => {
  try {
    const user = await User.findById(req.cookies?.uid);

    // Получаем данные из тела запроса
    const { object, defendants, debt, court, comments } = req.body;

    // Создаем новое дело
    const newCase = new Case({
      object,
      defendants,
      debt,
      court,
      comments,
      user: user._id, // Привязываем дело к текущему пользователю
    });

    // Сохраняем новое дело в базе данных
    await newCase.save();

    // Отправляем успешный ответ
    res.status(201).json({ message: "Заявление создано", case: newCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при создании заявления", error });
  }
};

module.exports = { createCase };

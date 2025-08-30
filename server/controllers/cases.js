const mongoose = require("mongoose");
const Case = require("../models/case");
const User = require("../models/user");

// Функция для создания нового дела
const createCase = async (req, res, next) => {
  try {
    // Получаем uid из куки и проверяем, есть ли он
    const userId = req.cookies?.uid;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Находим пользователя по uid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const caseData = req.body;
    console.log(caseData);

    // Создаем новый случай, гарантируя, что все обязательные поля заполнены
    const newCase = await Case.create({
      object: caseData.object,
      defendants: caseData.defendants.map((defendant) => ({
        ...defendant,
        _id: new mongoose.Types.ObjectId(), // создаем новый id для каждого ответчика
      })),
      debt: caseData.debt,
      court: caseData.court,
      comments: caseData.comments,
      user: user._id, // Связываем с текущим пользователем
    });

    res.status(201).json(newCase); // Возвращаем созданное дело
  } catch (error) {
    // Если ошибка, передаем её в middleware обработки ошибок
    next(error);
  }
};
const getUserCases = async (req, res, next) => {
  try {
    // Получаем uid из куки и проверяем, есть ли он
    const userId = req.cookies?.uid;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Находим пользователя по uid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Получаем все дела, связанные с пользователем
    const cases = await Case.find({ user: user._id });

    // Если дела не найдены
    if (cases.length === 0) {
      return res.status(404).json({ message: "No cases found for this user" });
    }

    // Возвращаем найденные дела
    res.status(200).json(cases);
  } catch (error) {
    // Если ошибка, передаем её в middleware обработки ошибок
    next(error);
  }
};

module.exports = { createCase, getUserCases };

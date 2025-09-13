const mongoose = require("mongoose");
const Case = require("../models/case");
const User = require("../models/user");

// Функция для создания нового дела
const createCase = async (req, res, next) => {
  try {
    const userId = req.cookies?.uid;
    const user = await User.findById(userId);
    const caseData = req.body;

    const newCase = await Case.create({
      ...caseData,
      user: user._id, // Связываем с текущим пользователем
    });
    res.status(201).json(newCase);
  } catch (error) {
    next(error);
  }
};
const getUserCases = async (req, res, next) => {
  try {
    const userId = req.cookies?.uid;
    const user = await User.findById(userId);

    const cases = await Case.find({ user: user._id });
    console.log('cases');

    res.status(200).json(cases);
  } catch (error) {
    next(error);
  }
};

module.exports = { createCase, getUserCases };

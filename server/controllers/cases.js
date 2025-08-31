const mongoose = require("mongoose");
const Case = require("../models/case");
const User = require("../models/user");
const { createDocForUser } = require("../services/userDriveDocs");
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
    // const folderId = process.env.USER_DRIVE_FOLDER_ID || undefined;
    // let googleDoc = null;
    // try {
    //   googleDoc = await createDocForUser(userId, newCase.toObject(), folderId);
    //   // (опционально) сохранить ссылку в кейс:
    //   // newCase.googleDoc = { id: googleDoc.docId, link: googleDoc.link };
    //   // await newCase.save();
    // } catch (e) {
    //   console.error("Failed to create Google Doc:", e?.message || e);
    // }
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

    res.status(200).json(cases);
  } catch (error) {
    next(error);
  }
};

module.exports = { createCase, getUserCases };

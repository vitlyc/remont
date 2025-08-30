const mongoose = require("mongoose"); // Добавьте это в начало файла
const User = require("./user");

const caseSchema = new mongoose.Schema(
  {
    object: {
      account: { type: String }, // Лицевой счёт
      objectAddress: { type: String }, // Адрес объекта
      area: { type: String }, // Площадь объекта
    },
    defendants: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: mongoose.Types.ObjectId,
        },
        surname: { type: String },
        name: { type: String },
        patronymic: { type: String },
        birthday: { type: Date },
        passport: { type: String },
        address: { type: String },
        share: { type: String },
      },
    ],
    debt: {
      principal: { type: Number },
      penalty: { type: Number },
      total: { type: Number },
      duty: { type: Number },
      period: {
        from: { type: Date },
        to: { type: Date },
      },
    },
    court: {
      name: { type: String }, // Название суда
      address: { type: String },
      dateSentToDebtor: { type: Date }, // Дата отправки должнику
      dateSentToCourt: { type: Date }, // Дата отправки в суд
      dateAcceptedForReview: { type: Date }, // Дата принятия к рассмотрению
      dateDecisionMade: { type: Date }, // Дата принятия решения
    },
    comments: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);

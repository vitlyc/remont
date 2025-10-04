const mongoose = require("mongoose"); // Добавьте это в начало файла
const User = require("./user");

const caseSchema = new mongoose.Schema(
  {
    object: {
      account: String,
      objectAddress: String,
      area: String,
    },
    defendants: [
      {
        id: mongoose.Schema.Types.ObjectId,
        surname: String,
        name: String,
        patronymic: String,
        birthday: Date,
        passport: String,
        address: String,
        share: String,
      },
    ],
    debt: {
      principal: Number,
      penalty: Number,
      total: Number,
      duty: Number,
      period: { from: Date, to: Date },
    },
    court: {
      name: String,
      address: String,
      dateSentToDebtor: Date,
      dateSentToCourt: Date,
      dateAcceptedForReview: Date,
      dateDecisionMade: Date,
    },
    comments: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    documents: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);

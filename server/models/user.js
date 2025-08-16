const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      select: false, // не возвращаем по умолчанию
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

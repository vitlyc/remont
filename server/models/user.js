// server/models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 4, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    google: {
      tokens: { type: mongoose.Schema.Types.Mixed, default: null }, // access_token/refresh_token и т.п.
      connectedAt: { type: Date },
    },
  },

  { timestamps: true }
);

// хеш пароля при создании/изменении
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// удобный метод сравнения пароля
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);

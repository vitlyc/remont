// server/controllers/users.js
const User = require("../models/user");

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.cookie("uid", user._id.toString(), cookieOpts);

    const obj = user.toObject();
    delete obj.password; // не отдаём пароль

    res.status(201).json({ user: obj });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: (req.body.email || "").toLowerCase(),
      password: req.body.password, // без хеша — прямое сравнение
    });

    if (!user) return res.status(401).json({ error: "invalid credentials" });

    res.cookie("uid", user._id.toString(), cookieOpts);

    const obj = user.toObject();
    delete obj.password; // не отдаём пароль

    res.status(201).json({ user: obj });
  } catch (e) {
    next(e);
  }
};

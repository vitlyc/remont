// server/controllers/users.js
const User = require("../models/user");

const isProd = process.env.NODE_ENV === "production";
console.log(isProd);

// ОДИН источник правды для опций куки
const cookieOpts = {
  httpOnly: true,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  sameSite: isProd ? "none" : "lax",
  secure: isProd, // в проде обязательно true (HTTPS)
};

const setUid = (res, id) => {
  res.cookie("uid", id.toString(), cookieOpts);
};

exports.register = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.email) body.email = String(body.email).trim().toLowerCase();

    const user = await User.create(body);
    setUid(res, user._id);

    const obj = user.toObject();
    delete obj.password;

    res.status(201).json({ user: obj });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    setUid(res, user._id);

    const obj = user.toObject();
    delete obj.password;

    res.json({ user: obj }); // 200
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const uid = req.cookies?.uid;
    if (!uid) return res.status(401).json({ error: "unauthorized" });

    const user = await User.findById(uid).select(
      "_id name email role createdAt updatedAt"
    );
    if (!user) return res.status(401).json({ error: "unauthorized" });

    res.json({ user });
  } catch (e) {
    next(e);
  }
};

exports.logout = (req, res) => {
  // Очищаем куку с ТЕМИ ЖЕ флагами, что и ставили
  res.clearCookie("uid", cookieOpts);
  res.json({ ok: true });
};

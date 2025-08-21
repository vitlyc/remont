// server/controllers/users.js
const User = require("../models/user");

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
const setUid = (res, id) => res.cookie("uid", id.toString(), cookieOpts);

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const obj = user.toObject();
    delete obj.password;
    res.status(201).json({ user: obj });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const ok = await user.comparePassword(req.body.password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });
    setUid(res, user._id);

    const obj = user.toObject();
    delete obj.password;
    res.json({ user: obj }); // 200
  } catch (e) {
    next(e);
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
  res.clearCookie("uid", { httpOnly: true, sameSite: "lax", path: "/" });
  res.json({ ok: true });
};

const express = require("express");
const router = express.Router();
const { register, login, logout, me } = require("../controllers/users");

router.post("/users/register", register);
router.post("/users/login", login);
router.post("/users/logout", logout);
router.get("/me", me);
module.exports = router;

const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/users");

router.post("/users/register", register);
router.post("/users/login", login);
router.post("/users/logout", logout);

module.exports = router;

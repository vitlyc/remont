const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/users");

router.post("/users/register", register);
router.post("/users/login", login);
module.exports = router;

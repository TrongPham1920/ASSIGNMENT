const express = require("express");
const router = express.Router();

const auth = require("../routers/auth");
const user = require("../routers/user");
const category = require("../routers/category");

router.use("/auth", auth);
router.use("/user", user);
router.use("/category", category);

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../routers/auth");
const user = require("../routers/user");
const category = require("../routers/category");
const product = require("../routers/product");

const img = require("../controllers/routeUpload");

router.use("/auth", auth);
router.use("/user", user);
router.use("/category", category);
router.use("/product", product);

router.use("/img", img);

module.exports = router;

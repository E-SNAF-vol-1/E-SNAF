const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/admin/login", controller.loginAdmin);
router.post("/logout", controller.logout);
router.get("/me", controller.me);

module.exports = router;
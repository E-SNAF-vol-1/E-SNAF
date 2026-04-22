const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");
const { requireUser } = require("../middleware/authMiddleware");

router.get("/", controller.getCart);
router.post("/save", controller.saveCart);
router.delete("/clear", requireUser, controller.clearCart);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");
const { requireUser } = require("../middleware/authMiddleware");

router.get("/", requireUser, controller.getCart);
router.post("/save", requireUser, controller.saveCart);
router.delete("/clear", requireUser, controller.clearCart);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const { requireUser, requireAdmin } = require("../middleware/authMiddleware");

router.post("/", requireUser, controller.createOrder);
router.get("/my", requireUser, controller.getMyOrders);
router.get("/my/:id", requireUser, controller.getMyOrderDetail);

router.get("/admin/all", requireAdmin, controller.getAllOrdersAdmin);
router.get("/admin/:id", requireAdmin, controller.getOrderDetailAdmin);
router.put("/admin/:id/status", requireAdmin, controller.updateStatus);

module.exports = router;
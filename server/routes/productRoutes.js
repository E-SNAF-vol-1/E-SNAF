const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const { requireAdmin } = require("../middleware/authMiddleware");

router.get("/search/live", controller.liveSearch);
router.get("/search", controller.searchProducts);
router.get("/:id", controller.getOne);
router.get("/", controller.getAll);

router.post("/", requireAdmin, controller.create);
router.put("/:id", requireAdmin, controller.update);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
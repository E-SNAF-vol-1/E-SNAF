const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const { requireAdmin } = require("../middleware/authMiddleware");

router.get("/", controller.getAll);
router.get('/search/live', controller.liveSearch);
router.get("/:id", controller.getOne);
router.post("/", requireAdmin, controller.create);
router.put("/:id", requireAdmin, controller.update);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");
const { requireAdmin } = require("../middleware/authMiddleware");

router.get("/", controller.getAll);
router.post("/", requireAdmin, controller.createCategory);
router.delete("/:id", requireAdmin, controller.deleteCategory);
router.post("/subcategories", requireAdmin, controller.createSubcategory);
router.delete("/subcategories/:id", requireAdmin, controller.deleteSubcategory);

module.exports = router;
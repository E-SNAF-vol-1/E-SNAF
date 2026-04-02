const express = require("express");
const router = express.Router();
const controller = require("../controllers/addressController");
const { requireUser } = require("../middleware/authMiddleware");

router.get("/", requireUser, controller.getMyAddresses);
router.post("/", requireUser, controller.createAddress);
router.put("/:id", requireUser, controller.updateAddress);
router.delete("/:id", requireUser, controller.deleteAddress);

module.exports = router;
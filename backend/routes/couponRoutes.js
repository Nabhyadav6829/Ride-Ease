// routes/couponRoutes.js
const express = require("express");
const router = express.Router();
const { getCoupons, createCoupon, updateCoupon, deleteCoupon } = require("../controllers/couponController");

// Public route (users can view)
router.get("/", getCoupons);

// Admin routes (restrict in real app)
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
 
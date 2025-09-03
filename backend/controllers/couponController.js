// controllers/couponController.js
const Coupon = require("../models/couponModel");

// @desc Get all active coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
};

// @desc Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: "Error creating coupon", error });
  }
};

// @desc Update coupon
exports.updateCoupon = async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating coupon", error });
  }
};

// @desc Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error });
  }
};

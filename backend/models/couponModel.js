// models/couponModel.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discount: { type: Number, required: true },
  maxDiscount: { type: Number, default: 0 }, // only for percentage
  minAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Coupon", couponSchema);

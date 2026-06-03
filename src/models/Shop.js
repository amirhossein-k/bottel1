import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerPhone: { type: String, required: true },

    bot: {
      token: { type: String, required: true },
      username: { type: String, default: "" },
      welcomeMessage: {
        type: String,
        default: "سلام! 👋\nبرای پیگیری سفارش، کد سفارش خود را ارسال کنید.",
      },
      notFoundMessage: {
        type: String,
        default: "❌ سفارشی با این کد پیدا نشد.\nلطفاً کد را بررسی کنید.",
      },
    },

    plan: {
      type: String,
      enum: ["basic", "pro", "unlimited"],
      default: "basic",
    },
    planExpiresAt: { type: Date, default: null },
    monthlyOrderLimit: { type: Number, default: 100 },
    currentMonthOrders: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);

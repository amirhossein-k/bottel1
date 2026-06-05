// src/models/Admin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },
    lastLogin: { type: Date, default: null },

    // ── پلن و محدودیت سفارش ──────────────────────────────────
    plan: {
      type: String,
      enum: ["plan1", "plan2", "plan3", "unlimited"],
      default: "plan1",
    },
    orderLimit: {
      type: Number,
      default: 500, // پلن ۱ پیش‌فرض
    },
    ordersUsed: {
      type: Number,
      default: 0,
    },
    planExpiresAt: {
      type: Date,
      default: null, // null = منقضی نشده / بدون تاریخ
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── متد: آیا سرویس فعال است؟ ─────────────────────────────────
AdminSchema.methods.hasActiveService = function () {
  if (this.role === "superadmin") return true;
  if (!this.isActive) return false;
  if (this.ordersUsed >= this.orderLimit) return false;
  return true;
};

// ── متد: سفارش مصرف کن ───────────────────────────────────────
AdminSchema.methods.consumeOrder = async function () {
  this.ordersUsed += 1;
  await this.save();
};

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

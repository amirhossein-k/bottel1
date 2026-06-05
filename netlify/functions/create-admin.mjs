// netlify/functions/create-admin.mjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PLANS = {
  plan1: { label: "پلن یک", orderLimit: 500 },
  plan2: { label: "پلن دو", orderLimit: 1000 },
  plan3: { label: "پلن سه", orderLimit: 1500 },
};

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    lastLogin: { type: Date, default: null },
    plan: { type: String, default: "plan1" },
    orderLimit: { type: Number, default: 500 },
    ordersUsed: { type: Number, default: 0 },
    planExpiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export async function handler(event, context) {
  const MONGODB_URI = process.env.MONGODB_URI;
  const USERNAME = process.env.ADMIN_USERNAME || "admin";
  const PASSWORD = process.env.ADMIN_PASSWORD || "123456";
  const ROLE = process.env.ADMIN_ROLE || "admin"; // admin یا superadmin
  const PLAN = process.env.ADMIN_PLAN || "plan1"; // plan1 / plan2 / plan3

  if (!MONGODB_URI) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "MONGODB_URI تنظیم نشده" }),
    };
  }

  // پلن معتبر است؟
  const planInfo = PLANS[PLAN];
  const isSuperAdmin = ROLE === "superadmin";
  const orderLimit = isSuperAdmin ? 999999 : (planInfo?.orderLimit ?? 500);
  const planKey = isSuperAdmin ? "unlimited" : planInfo ? PLAN : "plan1";

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, { dbName: "trackbot" });
    }

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
    const exists = await Admin.findOne({ username: USERNAME });

    if (exists) {
      // ── ادمین موجود است — فیلدهای پلن را آپدیت می‌کنیم ──
      const updated = await Admin.findOneAndUpdate(
        { username: USERNAME },
        {
          $set: {
            plan: planKey,
            orderLimit: orderLimit,
            ordersUsed: 0, // ریست مصرف
            isActive: true,
            role: ROLE,
          },
        },
        { new: true },
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `ادمین "${USERNAME}" از قبل وجود داشت — پلن آپدیت شد`,
          username: updated.username,
          role: updated.role,
          plan: updated.plan,
          orderLimit: updated.orderLimit,
          ordersUsed: updated.ordersUsed,
        }),
      };
    }

    // ── ادمین جدید بساز ──────────────────────────────────────
    const hashed = await bcrypt.hash(PASSWORD, 12);
    const admin = await Admin.create({
      username: USERNAME,
      password: hashed,
      role: ROLE,
      plan: planKey,
      orderLimit: orderLimit,
      ordersUsed: 0,
      isActive: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "ادمین با موفقیت ساخته شد ✅",
        username: admin.username,
        role: admin.role,
        plan: admin.plan,
        orderLimit: admin.orderLimit,
        ordersUsed: admin.ordersUsed,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

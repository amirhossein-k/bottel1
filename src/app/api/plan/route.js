// src/app/api/plan/route.js
// دریافت وضعیت پلن + درخواست تمدید

import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getSession } from "@/lib/auth";

export const PLANS = {
  plan1: {
    label: "پلن یک",
    orders: 500,
    price: "۱٬۰۰۰٬۰۰۰",
    priceRaw: 1000000,
  },
  plan2: {
    label: "پلن دو",
    orders: 1000,
    price: "۲٬۰۰۰٬۰۰۰",
    priceRaw: 2000000,
  },
  plan3: {
    label: "پلن سه",
    orders: 1500,
    price: "۳٬۰۰۰٬۰۰۰",
    priceRaw: 3000000,
  },
};

// GET /api/plan — وضعیت پلن ادمین جاری
export async function GET() {
  try {
    await connectDB();
    const session = await getSession();
    if (!session)
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const admin = await Admin.findOne({ username: session.user.username });
    if (!admin)
      return Response.json(
        { success: false, error: "Admin not found" },
        { status: 404 },
      );

    const used = admin.ordersUsed || 0;
    const limit = admin.orderLimit || 500;
    const planKey = admin.plan || "plan1";
    const planInfo = PLANS[planKey] || PLANS.plan1;
    const isExpired = used >= limit;
    const remaining = Math.max(0, limit - used);
    const percent = Math.min(100, Math.round((used / limit) * 100));

    return Response.json({
      success: true,
      data: {
        plan: planKey,
        planLabel: planInfo.label,
        orderLimit: limit,
        ordersUsed: used,
        remaining,
        percent,
        isExpired,
        username: admin.username,
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

// POST /api/plan — درخواست تمدید، ارسال پیام به تلگرام تیم مارلو
export async function POST(req) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session)
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const { selectedPlan } = await req.json();
    if (!PLANS[selectedPlan])
      return Response.json(
        { success: false, error: "پلن نامعتبر" },
        { status: 400 },
      );

    const admin = await Admin.findOne({ username: session.user.username });
    const planInfo = PLANS[selectedPlan];

    // ── ارسال پیام به تلگرام تیم مارلو ──────────────────────
    const MARLOW_BOT_TOKEN = process.env.MARLOW_BOT_TOKEN; // توکن ربات تیم مارلو
    const MARLOW_CHAT_ID = process.env.MARLOW_CHAT_ID; // چت آیدی تیم مارلو

    const msg =
      `🔔 <b>درخواست تمدید سرویس</b>\n\n` +
      `👤 یوزرنیم ادمین: <code>${admin.username}</code>\n` +
      `📦 پلن انتخابی: <b>${planInfo.label}</b>\n` +
      `📊 تعداد سفارش: ${planInfo.orders.toLocaleString("fa")} سفارش\n` +
      `💰 مبلغ: <b>${planInfo.price} تومان</b>\n` +
      `🕐 زمان درخواست: ${new Date().toLocaleString("fa-IR")}\n\n` +
      `⚡️ لطفاً پس از دریافت وجه، سرویس را فعال کنید.`;

    if (MARLOW_BOT_TOKEN && MARLOW_CHAT_ID) {
      await fetch(
        `https://api.telegram.org/bot${MARLOW_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: MARLOW_CHAT_ID,
            text: msg,
            parse_mode: "HTML",
          }),
        },
      );
    }

    return Response.json({
      success: true,
      message: "درخواست تمدید ثبت شد. تیم مارلو با شما تماس می‌گیرد.",
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

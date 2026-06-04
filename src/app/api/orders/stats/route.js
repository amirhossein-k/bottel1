// src/app/api/orders/stats/route.js

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const [statusCounts, totalRevenue, monthly] = await Promise.all([
      // تعداد هر وضعیت
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

      // کل درآمد (فقط delivered)
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // آمار ماهانه — ۱۲ ماه اخیر
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, "$totalAmount", 0],
              },
            },
            allRevenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    // تبدیل به آبجکت ساده برای byStatus
    const byStatus = {};
    statusCounts.forEach((s) => (byStatus[s._id] = s.count));

    // نام ماه‌های فارسی
    const MONTHS_FA = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    // پر کردن ماه‌های خالی (بدون سفارش)
    const monthlyFormatted = fillMissingMonths(monthly, MONTHS_FA);

    return Response.json({
      success: true,
      data: {
        total: await Order.countDocuments(),
        byStatus,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthly: monthlyFormatted,
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

// ── Helper: ماه‌های بدون سفارش رو با صفر پر می‌کنه ──────────
function fillMissingMonths(data, MONTHS_FA) {
  const now = new Date();
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 1-12

    const found = data.find(
      (r) => r._id.year === year && r._id.month === month,
    );

    result.push({
      label: MONTHS_FA[month - 1],
      year,
      month,
      count: found?.count || 0,
      revenue: found?.revenue || 0,
      allRevenue: found?.allRevenue || 0,
    });
  }

  return result;
}

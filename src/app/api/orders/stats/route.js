// src/app/api/orders/stats/route.js

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// ── تبدیل تاریخ میلادی به شمسی (بدون کتابخانه) ──────────────
function toJalali(gy, gm, gd) {
  const g_d_no = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const j_d_no = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  if (gy > 1600) {
    gy -= 1600;
  } else {
    gy -= 1200;
  }

  let g_day_no =
    365 * gy +
    Math.floor((gy + 3) / 4) -
    Math.floor((gy + 99) / 100) +
    Math.floor((gy + 399) / 400);

  for (let i = 0; i < gm - 1; i++) g_day_no += g_d_no[i];
  if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0))
    g_day_no++;
  g_day_no += gd - 1;

  let j_day_no = g_day_no - 79;
  const j_np = Math.floor(j_day_no / 12053);
  j_day_no %= 12053;

  let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  let jm, jd;
  for (jm = 0; jm < 11 && j_day_no >= j_d_no[jm]; jm++) {
    j_day_no -= j_d_no[jm];
  }
  jd = j_day_no + 1;

  return { jy, jm: jm + 1, jd }; // jm: 1-12
}

export async function GET() {
  try {
    await connectDB();

    const [statusCounts, totalRevenue, monthly] = await Promise.all([
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // ✅ داده خام میلادی از MongoDB — تبدیل شمسی در سمت Node انجام می‌شود
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

    const byStatus = {};
    statusCounts.forEach((s) => (byStatus[s._id] = s.count));

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

    // ✅ تبدیل داده‌های خام میلادی به شمسی قبل از fillMissingMonths
    const monthlyJalali = monthly.map((r) => {
      // اول روز ماه میلادی را به شمسی تبدیل می‌کنیم
      const { jy, jm } = toJalali(r._id.year, r._id.month, 1);
      return { ...r, _id: { year: jy, month: jm } };
    });

    const monthlyFormatted = fillMissingMonths(monthlyJalali, MONTHS_FA);

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

// ── Helper: ماه‌های خالی را با صفر پر می‌کند ─────────────────
// حالا با تاریخ شمسی کار می‌کند
function fillMissingMonths(data, MONTHS_FA) {
  const now = new Date();
  // تاریخ امروز را به شمسی تبدیل می‌کنیم
  const { jy: nowJY, jm: nowJM } = toJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  const result = [];

  for (let i = 11; i >= 0; i--) {
    // محاسبه ماه شمسی i ماه قبل از الان
    let month = nowJM - i;
    let year = nowJY;
    while (month <= 0) {
      month += 12;
      year--;
    }

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

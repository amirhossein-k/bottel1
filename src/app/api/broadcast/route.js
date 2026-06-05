// src/app/api/broadcast/route.js
// POST /api/broadcast
// body: { filter, message }
//
// فقط به مشتریانی پیام می‌فرستد که chatId دارند (ربات را استارت کرده‌اند)
// ارسال‌ها به صورت دسته‌ای انجام می‌شود تا rate-limit تلگرام رعایت شود

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendMessage } from "@/lib/bot";

// تاخیر بین هر پیام (میلی‌ثانیه) — تلگرام max 30 msg/sec دارد
const DELAY_MS = 50;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildFilter(filter) {
  const hasChatId = {
    "customer.chatId": { $exists: true, $ne: null, $ne: "" },
  };
  if (filter === "all_connected") return hasChatId;
  return { status: filter, ...hasChatId };
}

export async function POST(req) {
  try {
    await connectDB();
    const { filter, message } = await req.json();

    if (!message?.trim()) {
      return Response.json(
        { success: false, error: "متن پیام الزامی است" },
        { status: 400 },
      );
    }

    const token = process.env.BOT_TOKEN;
    if (!token) {
      return Response.json(
        { success: false, error: "BOT_TOKEN تنظیم نشده" },
        { status: 500 },
      );
    }

    // فقط سفارش‌هایی که chatId دارند را می‌گیریم
    const orders = await Order.find(buildFilter(filter || "all_connected"))
      .select("customer.chatId customer.name orderId")
      .lean();

    // حذف chatId تکراری (یک مشتری چند سفارش داشته باشد)
    const uniqueChatIds = [
      ...new Set(orders.map((o) => o.customer.chatId).filter(Boolean)),
    ];

    let sent = 0;
    let failed = 0;

    for (const chatId of uniqueChatIds) {
      try {
        await sendMessage(chatId, message.trim(), token);
        sent++;
      } catch {
        failed++;
      }
      // رعایت rate-limit تلگرام
      await sleep(DELAY_MS);
    }

    return Response.json({
      success: true,
      sent,
      failed,
      total: uniqueChatIds.length,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

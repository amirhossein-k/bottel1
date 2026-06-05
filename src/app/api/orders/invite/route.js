// src/app/api/orders/invite/route.js
//
// POST /api/orders/invite
// body: { orderId }
//
// کار این endpoint:
//  ۱. سفارش را پیدا می‌کند
//  ۲. یک لینک deep-link به ربات می‌سازد (t.me/BOT_USERNAME?start=orderId)
//  ۳. آن لینک را برمی‌گرداند تا ادمین بتواند به مشتری بدهد
//  ۴. اگر مشتری قبلاً chatId داشته باشد، مستقیم پیام می‌فرستد

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { notifyCustomer, sendMessage } from "@/lib/bot";

export async function POST(req) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    if (!orderId) {
      return Response.json(
        { success: false, error: "orderId الزامی است" },
        { status: 400 },
      );
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return Response.json(
        { success: false, error: "سفارش پیدا نشد" },
        { status: 404 },
      );
    }

    const botUsername = process.env.BOT_USERNAME;
    const botToken = process.env.BOT_TOKEN;

    if (!botUsername || !botToken) {
      return Response.json(
        { success: false, error: "BOT_USERNAME یا BOT_TOKEN تنظیم نشده" },
        { status: 500 },
      );
    }
    //
    // اگر مشتری قبلاً chatId دارد، مستقیم پیام می‌فرستیم
    if (order.customer.chatId) {
      await notifyCustomer(order);
      return Response.json({
        success: true,
        alreadyConnected: true,
        message: "مشتری قبلاً متصل بوده و پیام ارسال شد.",
      });
    }

    // ساخت deep-link: وقتی مشتری کلیک کند، ربات /start 1001 می‌گیرد
    const inviteLink = `https://t.me/${botUsername}?start=${orderId}`;

    return Response.json({
      success: true,
      alreadyConnected: false,
      inviteLink,
      message: `این لینک را برای مشتری ارسال کنید. بعد از کلیک، chatId ذخیره می‌شود.`,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

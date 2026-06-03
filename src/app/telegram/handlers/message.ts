// app/telegram/handlers/message.ts
import { Context } from "telegraf";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { sendError, replyToCustomer } from "@/lib/bot";


const MESSAGES = {
       welcome: `سلام! 👋\n\nبه ربات پیگیری سفارش خوش اومدی.\n\n📦 برای پیگیری سفارشت، <b>کد سفارش</b> خودت رو ارسال کن.\n\nمثال: <code>1001</code>`,
       notFound: `❌ سفارشی با این کد پیدا نشد.\n\nلطفاً کد سفارش رو از پیام تأیید خریدت کپی کن.\nدر صورت مشکل با پشتیبانی تماس بگیر. 📞`,
       wrongFormat: `⚠️ کد سفارش باید فقط عدد باشه.\n\nمثال: <code>1001</code>`,
};
export async function handleMessage(ctx: Context) {
       try {
              const msg = ctx.message;
              if (!msg || !("text" in msg) || !msg.text) return;

              const chatId = String(ctx.chat?.id);
              const text = msg.text.trim();
              const firstName = msg.from?.first_name || "کاربر";

              console.log(`[handleMessage] received: "${text}" from ${chatId}`);

              // اتصال به دیتابیس
              await connectDB();

              // هندلر استارت (اگر کاربر دوباره /start بفرستد)
              if (text === "/start") {
                     await sendError(chatId, `${MESSAGES.welcome}\n\n👤 ${firstName} عزیز، منتظر کد سفارشتم!`);
                     return;
              }

              if (text === "/help") {
                     await sendError(chatId, MESSAGES.welcome);
                     return;
              }

              // بررسی فرمت کد سفارش (فقط عدد)
              if (!/^\d+$/.test(text)) {
                     await sendError(chatId, MESSAGES.wrongFormat);
                     return;
              }

              // جستجوی سفارش
              const order = await Order.findOne({ orderId: text });
              if (!order) {
                     await sendError(chatId, MESSAGES.notFound);
                     return;
              }

              // ذخیره chatId اگر خالی است
              if (!order.customer.chatId) {
                     order.customer.chatId = chatId;
                     await order.save();
              }

              // ارسال جزئیات سفارش
              await replyToCustomer(chatId, order);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
       } catch (err: any) {
              console.error("[handleMessage] ERROR:", err.message);
              // سعی می‌کنیم خطا را به کاربر اطلاع دهیم
              try {
                     await ctx.reply("❌ خطایی رخ داد. لطفاً دوباره تلاش کنید.");
              } catch (e) { }
       }
}
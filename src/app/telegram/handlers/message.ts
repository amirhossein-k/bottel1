/* eslint-disable @typescript-eslint/no-explicit-any */
// app/telegram/handlers/message.ts
import { Context } from "telegraf";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { sendError, replyToCustomer, sendToAdmin, sendMessage } from "@/lib/bot";

const MESSAGES = {
       welcome: `سلام! 👋\n\nبه ربات پیگیری سفارش خوش اومدی.\n\n📦 برای پیگیری سفارشت، <b>کد سفارش</b> خودت رو ارسال کن.\n\nمثال: <code>1001</code>`,
       notFound: `❌ سفارشی با این کد پیدا نشد.\n\nلطفاً کد سفارش رو از پیام تأیید خریدت کپی کن.\nدر صورت مشکل با پشتیبانی تماس بگیر. 📞`,
       wrongFormat: `⚠️ کد سفارش باید فقط عدد باشه.\n\nمثال: <code>1001</code>`,
       askForOrderCode: `🔢 لطفاً کد سفارش خود را وارد کنید.`,
       askForMessage: `✏️ حالا پیام خود را برای فروشنده بنویسید.`,
       messageSent: `✅ پیام شما با موفقیت به فروشنده ارسال شد. به زودی پاسخ داده می‌شود.`,
       cancelChat: `❌ درخواست چت لغو شد.`,
};

// تعریف تایپ برای session (برای TypeScript)
interface MySession {
       waitingForOrderCode?: boolean;
       waitingForMessage?: boolean;
       tempOrderCode?: string;
       replyingTo?: string; // اضافه شده برای ذخیره chatId کاربر در حالت پاسخگویی

}

export async function handleReplyButton(ctx: any & { session?: MySession }) {
       // دریافت داده مستقیم از callback_query
       const callbackData = ctx.callbackQuery?.data;
       if (!callbackData) return;

       const userChatId = callbackData.replace('reply_to_', '');
       if (!userChatId) return;
       // ذخیره chatId کاربر در session جاری (ادمین) برای استفاده در مرحله بعد
       ctx.session = ctx.session || {};
       ctx.session.replyingTo = userChatId;


       // اطلاع‌رسانی به ادمین برای ارسال پاسخ
       await ctx.answerCbQuery('✅ در حال آماده‌سازی پاسخ...');
       await ctx.reply(`✏️ لطفاً پاسخ خود را برای کاربر با آیدی ${userChatId} ارسال کنید.`);

       // در صورت تمایل می‌توانید بعد از کلیک، دکمه را غیرفعال کنید
       await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
}

export async function handleMessage(ctx: Context & { session?: MySession }) {
       try {
              const msg = ctx.message;
              if (!msg || !("text" in msg) || !msg.text) return;

              const chatId = String(ctx.chat?.id);
              const text = msg.text.trim();
              const firstName = msg.from?.first_name || "کاربر";

              console.log(`[handleMessage] received: "${text}" from ${chatId}`);

              // ----- START: مدیریت پاسخ ادمین -----
              const adminChatId = process.env.ADMIN_CHAT_ID;
              if (chatId === adminChatId && ctx.session?.replyingTo) {
                     const targetUserId = ctx.session.replyingTo;
                     await sendMessage(targetUserId, text, process.env.BOT_TOKEN!);
                     await ctx.reply(`✅ پیام شما با موفقیت به کاربر ارسال شد.`);
                     delete ctx.session.replyingTo;
                     return;
              }
              // ----- END: مدیریت پاسخ ادمین -----
              // اتصال به دیتابیس (برای سایر عملیات)
              await connectDB();

              // ── مدیریت دستور /chat ─────────────────────────────
              if (text === "/chat") {
                     ctx.session = ctx.session || {};
                     ctx.session.waitingForOrderCode = true;
                     ctx.session.waitingForMessage = false;
                     ctx.session.tempOrderCode = undefined;
                     await sendError(chatId, MESSAGES.askForOrderCode);
                     return;
              }

              // ── اگر کاربر در حالت انتظار کد سفارش است ───────────
              if (ctx.session?.waitingForOrderCode) {
                     // اگر کاربر دستور لغو بفرستد
                     if (text === "/cancel") {
                            ctx.session.waitingForOrderCode = false;
                            await sendError(chatId, MESSAGES.cancelChat);
                            return;
                     }

                     // بررسی فرمت کد سفارش (فقط عدد)
                     if (!/^\d+$/.test(text)) {
                            await sendError(chatId, MESSAGES.wrongFormat);
                            return;
                     }

                     // جستجوی سفارش در دیتابیس
                     const order = await Order.findOne({ orderId: text });
                     if (!order) {
                            await sendError(chatId, MESSAGES.notFound);
                            return;
                     }

                     // ذخیره کد سفارش در session و رفتن به مرحله بعد
                     ctx.session.waitingForOrderCode = false;
                     ctx.session.waitingForMessage = true;
                     ctx.session.tempOrderCode = text;

                     await sendError(chatId, MESSAGES.askForMessage);
                     return;
              }

              // ── اگر کاربر در حالت انتظار پیام است ─────────────
              if (ctx.session?.waitingForMessage) {
                     if (text === "/cancel") {
                            ctx.session.waitingForMessage = false;
                            ctx.session.tempOrderCode = undefined;
                            await sendError(chatId, MESSAGES.cancelChat);
                            return;
                     }

                     const orderCode = ctx.session.tempOrderCode;
                     if (!orderCode) {
                            // حالت نامعتبر: ریست می‌کنیم
                            ctx.session.waitingForMessage = false;
                            await sendError(chatId, "❌ خطا. لطفاً دوباره با /chat شروع کنید.");
                            return;
                     }

                     // ارسال پیام به ادمین
                     await sendToAdmin(chatId, orderCode, text, firstName);

                     // پاک کردن session و اتمام
                     ctx.session.waitingForMessage = false;
                     ctx.session.tempOrderCode = undefined;
                     await sendError(chatId, MESSAGES.messageSent);
                     return;
              }

              // ── بقیه دستورات عادی ─────────────────────────────
              if (text === "/start") {
                     await sendError(chatId, `${MESSAGES.welcome}\n\n👤 ${firstName} عزیز، منتظر کد سفارشتم!`);
                     return;
              }

              if (text === "/help") {
                     await sendError(chatId, MESSAGES.welcome);
                     return;
              }

              // بررسی فرمت کد سفارش (فقط عدد) برای پیگیری عادی
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
       } catch (err: any) {
              console.error("[handleMessage] ERROR:", err.message);
              try {
                     await ctx.reply("❌ خطایی رخ داد. لطفاً دوباره تلاش کنید.");
              } catch (e) { }
       }
}
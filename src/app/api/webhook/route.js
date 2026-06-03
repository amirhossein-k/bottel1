import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { replyToCustomer, sendError } from "@/lib/bot";

const MESSAGES = {
  welcome: `سلام! 👋\n\nبه ربات پیگیری سفارش خوش اومدی.\n\n📦 برای پیگیری سفارشت، <b>کد سفارش</b> خودت رو ارسال کن.\n\nمثال: <code>1001</code>`,
  notFound: `❌ سفارشی با این کد پیدا نشد.\n\nلطفاً کد سفارش رو از پیام تأیید خریدت کپی کن.\nدر صورت مشکل با پشتیبانی تماس بگیر. 📞`,
  wrongFormat: `⚠️ کد سفارش باید فقط عدد باشه.\n\nمثال: <code>1001</code>`,
};

async function handleUpdate(update) {
  const msg = update.message;
  if (!msg || !msg.text) return;

  const chatId = String(msg.chat.id);
  const text = msg.text.trim();
  const firstName = msg.from?.first_name || "کاربر";

  await connectDB();

  if (text === "/start") {
    return sendError(
      chatId,
      `${MESSAGES.welcome}\n\n👤 ${firstName} عزیز، منتظر کد سفارشتم!`,
    );
  }

  if (text === "/help") {
    return sendError(chatId, MESSAGES.welcome);
  }

  if (!/^\d+$/.test(text)) {
    return sendError(chatId, MESSAGES.wrongFormat);
  }

  const order = await Order.findOne({ orderId: text });

  if (!order) {
    return sendError(chatId, MESSAGES.notFound);
  }

  if (!order.customer.chatId) {
    order.customer.chatId = chatId;
    await order.save();
  }

  return replyToCustomer(chatId, order);
}

export async function POST(req) {
  // ابتدا یک پاسخ سریع 200 برمی‌گردانیم تا وب‌هوک قطع نشود
  const immediateResponse = Response.json({ ok: true });

  // سپس منطق اصلی را به صورت ناهمگام (async) و بدون `await` اجرا می‌کنیم
  (async () => {
    try {
      const update = await req.json();
      await handleUpdate(update);
    } catch (err) {
      console.error("Webhook async error:", err);
    }
  })();

  return immediateResponse;
}

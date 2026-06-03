// app/api/webhook/route.js (نسخه دیباگ همگام)
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { replyToCustomer, sendError } from "@/lib/bot";

const MESSAGES = {
  welcome: `سلام! 👋\n\nبه ربات پیگیری سفارش خوش اومدی.\n\n📦 برای پیگیری سفارشت، <b>کد سفارش</b> خودت رو ارسال کن.\n\nمثال: <code>1001</code>`,
  notFound: `❌ سفارشی با این کد پیدا نشد.\n\nلطفاً کد سفارش رو از پیام تأیید خریدت کپی کن.\nدر صورت مشکل با پشتیبانی تماس بگیر. 📞`,
  wrongFormat: `⚠️ کد سفارش باید فقط عدد باشه.\n\nمثال: <code>1001</code>`,
};

export async function POST(req) {
  console.log("[POST] start (sync mode)");
  try {
    const update = await req.json();
    const msg = update.message;
    if (!msg || !msg.text) return Response.json({ ok: true });

    const chatId = String(msg.chat.id);
    const text = msg.text.trim();
    const firstName = msg.from?.first_name || "کاربر";

    console.log(`[POST] connecting to DB...`);
    await connectDB(); // <-- اگر خطا بدهد، catch می‌کند
    console.log(`[POST] DB connected`);

    if (text === "/start") {
      await sendError(chatId, `${MESSAGES.welcome}\n\n👤 ${firstName} عزیز...`);
    } else {
      // سایر منطق‌ها را می‌توانید ساده نگه دارید
      return Response.json({ ok: true });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST] ERROR:", err.message);
    console.error(err.stack);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// import { connectDB } from "@/lib/mongodb";
// import Order from "@/models/Order";
// import { replyToCustomer, sendError } from "@/lib/bot";

// const MESSAGES = {
//   welcome: `سلام! 👋\n\nبه ربات پیگیری سفارش خوش اومدی.\n\n📦 برای پیگیری سفارشت، <b>کد سفارش</b> خودت رو ارسال کن.\n\nمثال: <code>1001</code>`,
//   notFound: `❌ سفارشی با این کد پیدا نشد.\n\nلطفاً کد سفارش رو از پیام تأیید خریدت کپی کن.\nدر صورت مشکل با پشتیبانی تماس بگیر. 📞`,
//   wrongFormat: `⚠️ کد سفارش باید فقط عدد باشه.\n\nمثال: <code>1001</code>`,
// };

// async function handleUpdate(update) {
//   try {
//     console.log("[handleUpdate] started");
//     const msg = update.message;
//     if (!msg || !msg.text) return;

//     const chatId = String(msg.chat.id);
//     const text = msg.text.trim();
//     const firstName = msg.from?.first_name || "کاربر";

//     console.log(`[handleUpdate] received: "${text}" from ${chatId}`);

//     console.log("[handleUpdate] connecting to DB...");
//     await connectDB();
//     console.log("[handleUpdate] DB connected");

//     if (text === "/start") {
//       console.log("[handleUpdate] sending welcome");
//       await sendError(
//         chatId,
//         `${MESSAGES.welcome}\n\n👤 ${firstName} عزیز، منتظر کد سفارشتم!`,
//       );
//       console.log("[handleUpdate] welcome sent");
//       return;
//     }

//     if (text === "/help") {
//       await sendError(chatId, MESSAGES.welcome);
//       return;
//     }

//     if (!/^\d+$/.test(text)) {
//       await sendError(chatId, MESSAGES.wrongFormat);
//       return;
//     }

//     console.log(`[handleUpdate] searching for orderId: ${text}`);
//     const order = await Order.findOne({ orderId: text });
//     if (!order) {
//       console.log("[handleUpdate] order not found");
//       await sendError(chatId, MESSAGES.notFound);
//       return;
//     }

//     console.log("[handleUpdate] order found, checking chatId");
//     if (!order.customer.chatId) {
//       order.customer.chatId = chatId;
//       await order.save();
//       console.log("[handleUpdate] chatId saved");
//     }

//     console.log("[handleUpdate] sending order details");
//     await replyToCustomer(chatId, order);
//     console.log("[handleUpdate] order details sent");
//   } catch (err) {
//     console.error("[handleUpdate] ERROR:", err.message);
//     console.error(err.stack);
//   }
// }

// export async function POST(req) {
//   console.log("[POST] Webhook function started");

//   // Return immediate response
//   const immediateResponse = Response.json({ ok: true });

//   // Process asynchronously
//   (async () => {
//     try {
//       const update = await req.json();
//       console.log(
//         "[POST] Received update:",
//         JSON.stringify(update).slice(0, 200),
//       );
//       await handleUpdate(update);
//       console.log("[POST] Async processing completed");
//     } catch (err) {
//       console.error("[POST] Fatal error in async handler:", err.message);
//       console.error(err.stack);
//     }
//   })();

//   return immediateResponse;
// }

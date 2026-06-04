// src\lib\bot.js
import { Markup } from "telegraf"; // Markup را از telegraf import کنید

const STATUS_MESSAGES = {
  pending: { icon: "⏳", label: "در انتظار تایید" },
  confirmed: { icon: "✅", label: "تایید شده" },
  processing: { icon: "📦", label: "در حال آماده‌سازی" },
  shipped: { icon: "🚚", label: "ارسال شد" },
  delivered: { icon: "🎉", label: "تحویل داده شد" },
  cancelled: { icon: "❌", label: "لغو شد" },
};

export async function sendMessage(chatId, text, token, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };
  // اگر replyMarkup (مثل Inline Keyboard) ارسال شده باشد، آن را به payload اضافه کن
  if (replyMarkup) {
    payload.reply_markup = replyMarkup.reply_markup;
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
export async function sendToAdmin(
  chatId,
  orderCode,
  userMessage,
  userFirstName,
) {
  const token = process.env.BOT_TOKEN;
  const adminChatId = process.env.ADMIN_CHAT_ID; // باید در .env و Netlify تنظیم شود

  if (!adminChatId) {
    console.error("❌ ADMIN_CHAT_ID تنظیم نشده");
    return;
  }
  // ایجاد یک دکمه Inline با داده‌های خاص که حاوی chatId کاربر است
  const replyButton = Markup.inlineKeyboard([
    Markup.button.callback("📩 پاسخ به کاربر", `reply_to_${chatId}`),
  ]);

  const text =
    `📩 پیام جدید از کاربر:\n\n` +
    `👤 نام: ${userFirstName}\n` +
    `🆔 چت آیدی: ${chatId}\n` +
    `📦 کد سفارش: ${orderCode}\n` +
    `💬 پیام:\n${userMessage}`;

  return sendMessage(adminChatId, text, token, replyButton);
}

export function buildOrderMessage(order) {
  const st = STATUS_MESSAGES[order.status];
  const items = order.items
    .map((i) => `  • ${i.name} × ${i.quantity}`)
    .join("\n");

  let msg = `${st.icon} <b>سفارش #${order.orderId}</b>\n`;
  msg += `━━━━━━━━━━━━━━\n`;
  msg += `👤 ${order.customer.name}\n`;
  msg += `📌 وضعیت: <b>${st.label}</b>\n\n`;
  msg += `🛍 محصولات:\n${items}\n`;
  msg += `💰 مبلغ کل: ${order.totalAmount.toLocaleString("fa")} تومان\n`;

  if (order.shipping?.trackingCode) {
    msg += `\n🚚 شرکت پست: ${order.shipping.carrier || "پست"}\n`;
    msg += `📮 کد رهگیری: <code>${order.shipping.trackingCode}</code>\n`;
    msg += `🔗 رهگیری: tracking.post.ir`;
  }

  if (order.adminNote) {
    msg += `\n📝 یادداشت: ${order.adminNote}`;
  }

  return msg;
}

export async function notifyCustomer(order) {
  const token = process.env.BOT_TOKEN;
  if (!token || !order.customer.chatId) return;
  return sendMessage(order.customer.chatId, buildOrderMessage(order), token);
}

export async function replyToCustomer(chatId, order) {
  const token = process.env.BOT_TOKEN;
  return sendMessage(chatId, buildOrderMessage(order), token);
}

export async function sendError(chatId, message) {
  const token = process.env.BOT_TOKEN;
  return sendMessage(chatId, message, token);
}
export async function sendChat(chatId, message) {
  const token = process.env.BOT_TOKEN;

  return sendMessage(chatId, message, token);
}

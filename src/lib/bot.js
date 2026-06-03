// src\lib\bot.js
const STATUS_MESSAGES = {
  pending: { icon: "⏳", label: "در انتظار تایید" },
  confirmed: { icon: "✅", label: "تایید شده" },
  processing: { icon: "📦", label: "در حال آماده‌سازی" },
  shipped: { icon: "🚚", label: "ارسال شد" },
  delivered: { icon: "🎉", label: "تحویل داده شد" },
  cancelled: { icon: "❌", label: "لغو شد" },
};

async function sendMessage(chatId, text, token) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  return res.json();
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

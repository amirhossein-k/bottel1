const BOT_TOKEN = process.env.BOT_TOKEN;
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

if (!BOT_TOKEN || !DOMAIN) {
  console.error("❌ BOT_TOKEN و NEXT_PUBLIC_DOMAIN رو در .env تنظیم کن");
  process.exit(1);
}

const WEBHOOK_URL = `${DOMAIN}/api/webhook`;

async function setup() {
  console.log("🔧 در حال تنظیم webhook...\n");

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: WEBHOOK_URL }),
    },
  );

  const data = await res.json();

  if (data.ok) {
    console.log(`✅ Webhook ست شد: ${WEBHOOK_URL}`);
  } else {
    console.error("❌ خطا:", data.description);
  }

  const botRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
  const bot = await botRes.json();
  if (bot.ok) {
    console.log(`🤖 ربات: @${bot.result.username}`);
  }
}

setup();

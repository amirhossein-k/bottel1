// netlify/functions/set-webhook.mjs
export async function handler(event, context) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

  if (!BOT_TOKEN || !DOMAIN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "BOT_TOKEN یا DOMAIN تعریف نشده" }),
    };
  }

  const WEBHOOK_URL = `${DOMAIN}/api/telegram`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: WEBHOOK_URL }),
    });
    const data = await res.json();

    if (data.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Webhook set to ${WEBHOOK_URL}`,
          ok: true,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.description }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

// src\app\telegram\bot.ts
import { Telegraf } from "telegraf";
import { startHandler } from "./handlers/start";
import { handleMessage } from "./handlers/message";
const bot = new Telegraf(process.env.BOT_TOKEN!);
bot.start(startHandler()); // اینجا هندلر استارت جدید

bot.on("text", handleMessage);

export async function POST(req: Request) {
       try {
              const body = await req.json();
              await bot.handleUpdate(body);
              return new Response("OK", { status: 200 });
       } catch (err) {
              console.error("❌ Error in POST handler:", err);
              return new Response("Error", { status: 500 });
       }
       // ''
}

export default bot;

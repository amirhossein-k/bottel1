// // app\telegram\handlers\start.js

import { connectDB } from "@/app/lib/mongodb";
const MESSAGES = {
  welcome: `سلام! 👋\n\nبه ربات پیگیری سفارش خوش اومدی.\n\n📦 برای پیگیری سفارشت، <b>کد سفارش</b> خودت رو ارسال کن.\n\nمثال: <code>1001</code>`,
  notFound: `❌ سفارشی با این کد پیدا نشد.\n\nلطفاً کد سفارش رو از پیام تأیید خریدت کپی کن.\nدر صورت مشکل با پشتیبانی تماس بگیر. 📞`,
  wrongFormat: `⚠️ کد سفارش باید فقط عدد باشه.\n\nمثال: <code>1001</code>`,
};
export function startHandler() {
  return async (ctx) => {
    await connectDB();
    // const msg = ctx.message;
    //     if (!msg || !msg.text) return;

    //   }
    await ctx.reply(
      "👋 خوش آمدی! بیا پروفایلت رو بسازیم.\n\n📌 مرحله ۱ از ۵: لطفاً اسمت رو ارسال کن.",
    );
  };
}

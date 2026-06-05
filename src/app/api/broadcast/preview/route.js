// src/app/api/broadcast/preview/route.js
// GET /api/broadcast/preview?filter=all_connected
// برمی‌گرداند چند نفر پیام می‌گیرند و چند نفر chatId ندارند

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

function buildFilter(filter) {
  const hasChatId = {
    "customer.chatId": { $exists: true, $ne: null, $ne: "" },
  };
  if (filter === "all_connected") return hasChatId;
  return { status: filter, ...hasChatId };
}

function buildTotalFilter(filter) {
  if (filter === "all_connected") return {};
  return { status: filter };
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all_connected";

    const [total, connected] = await Promise.all([
      Order.countDocuments(buildTotalFilter(filter)),
      Order.countDocuments(buildFilter(filter)),
    ]);

    return Response.json({
      success: true,
      total,
      connected,
      noChat: total - connected,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Admin from "@/models/Admin";
import { getSession } from "next-auth/react";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // ── بررسی محدودیت پلن ────────────────────────────────────
    const session = await getSession();
    if (session) {
      const admin = await Admin.findOne({ username: session.user.username });
      if (admin && admin.role !== "superadmin") {
        if (!admin.hasActiveService()) {
          return Response.json(
            {
              success: false,
              error: "service_expired",
              message:
                "سقف سفارش‌های پلن شما تمام شده. لطفاً سرویس را تمدید کنید.",
            },
            { status: 403 },
          );
        }
        // مصرف یک سفارش از سهمیه
        await admin.consumeOrder();
      }
    }
    // ────────────────────────────────────────────────────────

    const body = await req.json();
    const count = await Order.countDocuments();
    const orderId = String(1000 + count + 1);

    const order = await Order.create({
      orderId,
      customer: {
        name: body.customer || "",
        phone: body.phone || "",
        chatId: body.chatId || "",
      },
      items: [
        {
          name: body.product || "",
          quantity: 1,
          price: Number(body.amount) || 0,
        },
      ],
      totalAmount: Number(body.amount) || 0,
      address: {
        city: "",
        detail: body.address || "",
        postalCode: "",
      },
      status: body.status || "pending",
      statusHistory: [{ status: body.status || "pending" }],
    });

    return Response.json({ success: true, data: order }, { status: 201 });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

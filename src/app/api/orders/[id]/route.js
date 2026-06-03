import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { notifyCustomer } from "@/lib/bot";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const order = await Order.findOne({ orderId: params.id });
    if (!order)
      return Response.json(
        { success: false, error: "سفارش پیدا نشد" },
        { status: 404 },
      );
    return Response.json({ success: true, data: order });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await Order.findOne({ orderId: params.id });
    if (!order)
      return Response.json(
        { success: false, error: "سفارش پیدا نشد" },
        { status: 404 },
      );

    const prevStatus = order.status;

    if (body.status) order.status = body.status;
    if (body.adminNote !== undefined) order.adminNote = body.adminNote;
    if (body.shipping) order.shipping = { ...order.shipping, ...body.shipping };
    if (body.customer) order.customer = { ...order.customer, ...body.customer };

    if (body.status && body.status !== prevStatus) {
      order.statusHistory.push({
        status: body.status,
        note: body.adminNote || "",
        changedAt: new Date(),
      });

      if (order.customer.chatId) {
        await notifyCustomer(order);
      }
    }

    await order.save();
    return Response.json({ success: true, data: order });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Order.findOneAndDelete({ orderId: params.id });
    return Response.json({ success: true, message: "سفارش حذف شد" });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

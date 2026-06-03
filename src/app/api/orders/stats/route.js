import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();

    const [statusCounts, recentOrders, totalRevenue] = await Promise.all([
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const stats = {};
    statusCounts.forEach((s) => (stats[s._id] = s.count));

    return Response.json({
      success: true,
      data: {
        total: await Order.countDocuments(),
        byStatus: stats,
        recentOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

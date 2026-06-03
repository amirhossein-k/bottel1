import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      chatId: { type: String, default: null },
    },

    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },

    address: {
      city: { type: String, default: "" },
      detail: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    shipping: {
      carrier: { type: String, default: "" },
      trackingCode: { type: String, default: "" },
      estimatedDelivery: { type: Date, default: null },
    },

    adminNote: { type: String, default: "" },

    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

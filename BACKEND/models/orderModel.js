import mongoose from "mongoose";

function generateOrderNumber() {
  const timeSegment = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${timeSegment}-${rand}`;
}

const orderSchema = new mongoose.Schema(
  {
    // Not required; generated automatically for tracking
    orderNumber: { type: String, default: generateOrderNumber },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    deliveryDetails: {
      name: String,
      email: String,
      address: String,
      district: String,
      state: String,
      pincode: String,
      phone1: String,
      phone2: String,
    },
    paymentMethod: { type: String, enum: ["cod", "upi", "card"], default: "cod" },
    subtotalAmount: { type: Number, required: true },
    discountAmount: { type: Number, required: true, default: 0 },
    finalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" },
  },
  { timestamps: true }
);

// Ensure a partial unique index so only non-null/non-missing values are enforced unique
orderSchema.index(
  { orderNumber: 1 },
  { name: "orderNumber_unique", unique: true, partialFilterExpression: { orderNumber: { $type: "string" } } }
);

export default mongoose.model("Order", orderSchema);

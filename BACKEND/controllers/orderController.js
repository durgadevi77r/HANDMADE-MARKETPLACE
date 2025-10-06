import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// Checkout (place order)
export const checkoutOrder = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { deliveryDetails, paymentMethod, items: clientItems, subtotalAmount, discountAmount, finalAmount } = req.body;

    let items = [];
    let subtotal = 0;
    let discount = 0;
    let final = 0;

    if (Array.isArray(clientItems) && clientItems.length > 0) {
      // Use client-provided items (e.g., from localStorage cart)
      items = clientItems.map((i) => {
        const mapped = {
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        };
        // Only set product if looks like a valid ObjectId (24 hex chars)
        const candidate = i.product || i._id;
        if (typeof candidate === "string" && /^[a-fA-F0-9]{24}$/.test(candidate)) {
          mapped.product = candidate;
        }
        return mapped;
      });
      // Final sanitize to ensure no invalid product ids slip through
      const objectIdRegex = /^[a-fA-F0-9]{24}$/;
      items = items.map((it) => {
        if (it.product && !(typeof it.product === "string" && objectIdRegex.test(it.product))) {
          const { product, ...rest } = it;
          return rest;
        }
        return it;
      });
      // Use provided totals if present, otherwise compute
      const computedSubtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);
      subtotal = typeof subtotalAmount === "number" ? subtotalAmount : computedSubtotal;
      discount = typeof discountAmount === "number" ? discountAmount : (subtotal > 1000 ? subtotal * 0.12 : 0);
      final = typeof finalAmount === "number" ? finalAmount : (subtotal - discount);
    } else {
      // Fallback to server cart
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      items = cart.items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      }));
      subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      discount = subtotal > 1000 ? subtotal * 0.12 : 0;
      final = subtotal - discount;
      // Clear cart after placing order (only in fallback mode)
      cart.items = [];
      await cart.save();
    }

    const order = new Order({
      user: userId,
      items,
      deliveryDetails,
      paymentMethod,
      subtotalAmount: subtotal,
      discountAmount: discount,
      finalAmount: final,
    });

    // Validate stock (when product ids are present)
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    const productItems = items.filter((i) => typeof i.product === 'string' && objectIdRegex.test(i.product));
    for (const it of productItems) {
      const prod = await Product.findById(it.product).select('stock name');
      if (prod && (it.quantity || 0) > prod.stock) {
        return res.status(400).json({ message: `Insufficient stock for ${prod.name}` });
      }
    }

    await order.save();

    // Decrement stock and increment orderCount for each product
    try {
      // Resolve any missing product ObjectIds by slug or name
      const missing = items.filter((i) => !i.product && (i.name));
      if (missing.length > 0) {
        const names = [...new Set(missing.map((m) => m.name))];
        const candidates = await Product.find({ $or: [{ name: { $in: names } }] }).select('_id name');
        const nameToId = new Map(candidates.map((p) => [p.name, p._id.toString()]));
        items = items.map((it) => ({ ...it, product: it.product || nameToId.get(it.name) }));
      }

      const valid = items.filter((i) => typeof i.product === 'string' && /^[a-fA-F0-9]{24}$/.test(i.product));
      if (valid.length > 0) {
        const ops = valid.map((i) => {
          const qty = Math.max(0, i.quantity || 0);
          const oid = mongoose.Types.ObjectId.createFromHexString(i.product);
          return {
            updateOne: {
              filter: { _id: oid },
              update: { $inc: { stock: -qty, orderCount: qty } },
            }
          };
        });
        await Product.bulkWrite(ops);
      }
    } catch (_) { /* non-blocking */ }

    // Save delivery details to user address for future orders (first or subsequent)
    if (deliveryDetails && userId) {
      try {
        const { name, email, address, district, state, pincode } = deliveryDetails;
        await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              name: name || undefined,
              email: email || undefined,
              address: {
                street: address || undefined,
                city: district || undefined,
                state: state || undefined,
                postalCode: pincode || undefined,
              },
            },
          },
          { new: true }
        );
      } catch (_) { /* non-blocking */ }
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error?.errors?.["items.0.product"]?.message || error.message || "Server error";
    res.status(500).json({ message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

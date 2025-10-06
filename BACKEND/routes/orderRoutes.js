import express from "express";
import { checkoutOrder, getUserOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", protect, checkoutOrder);   // Place order
router.get("/", protect, getUserOrders);            // Get user's orders

export default router;

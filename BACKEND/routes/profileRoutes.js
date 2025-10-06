import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateAddress,
  getAddress,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Wishlist routes
router.route('/wishlist')
  .get(getWishlist)
  .post(addToWishlist);
router.route('/wishlist/:productId').delete(removeFromWishlist);

// Address routes
router.route('/address')
  .get(getAddress)
  .put(updateAddress);

export default router;
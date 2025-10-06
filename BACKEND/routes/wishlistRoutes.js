import express from 'express';
import { toggleWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getWishlist);

// Toggle like/unlike
router.post('/toggle', toggleWishlist);

// Remove by productId
router.route('/:productId')
  .delete(removeFromWishlist);

export default router;
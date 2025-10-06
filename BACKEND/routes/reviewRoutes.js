import express from 'express';
import { upsertReview, listProductReviews, getReviewById, listUserReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create/update a review
router.post('/', protect, upsertReview);

// List reviews for a product
router.get('/product/:productId', listProductReviews);

// Review details
router.get('/:id', getReviewById);

// Authenticated user's reviews
router.get('/', protect, listUserReviews);

// Temporary test endpoint to check if reviews exist (no auth required)
router.get('/test-all', async (req, res) => {
  try {
    const Review = (await import('../models/reviewModel.js')).default;
    const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(10);
    console.log('Test endpoint found reviews:', reviews.length);
    res.json({ reviews, total: reviews.length, message: 'Test endpoint working - no auth required' });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ message: 'Test endpoint error', error: error.message });
  }
});

export default router;



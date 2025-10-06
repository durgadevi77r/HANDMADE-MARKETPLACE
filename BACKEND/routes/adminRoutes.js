import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  getOrdersReport,
  getAllWishlists,
  getAllCarts,
} from '../controllers/adminController.js';
import { listAllReviews } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temporary admin reviews endpoint without middleware for testing (BEFORE auth middleware)
router.get('/all-reviews-test', async (req, res) => {
  try {
    const Review = (await import('../models/reviewModel.js')).default;
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .limit(50);
    
    console.log(`Admin test endpoint found ${reviews.length} reviews`);
    res.json({ 
      reviews, 
      total: reviews.length, 
      message: 'Admin test endpoint - all reviews without auth',
      success: true 
    });
  } catch (error) {
    console.error('Admin test endpoint error:', error);
    res.status(500).json({ message: 'Admin test endpoint error', error: error.message });
  }
});

// Check current user role (no auth required for debugging)
router.get('/check-user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ message: 'No token provided', hasToken: false });
    }
    
    const jwt = (await import('jsonwebtoken')).default;
    const User = (await import('../models/userModel.js')).default;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    res.json({ 
      message: 'User info retrieved',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin
      },
      hasToken: true,
      tokenValid: true
    });
  } catch (error) {
    res.json({ 
      message: 'Token validation failed', 
      error: error.message,
      hasToken: true,
      tokenValid: false
    });
  }
});

// All routes BELOW this line are protected with admin middleware
router.use(protect, admin);

// User management routes
router.route('/users').get(getUsers);
router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Dashboard statistics
router.get('/dashboard', getDashboardStats);
router.get('/reports', getOrdersReport);

// All reviews for admin dashboard
router.get('/reviews', listAllReviews);

// Wishlist and cart management
router.get('/wishlists', getAllWishlists);
router.get('/carts', getAllCarts);

export default router;
import express from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategoryAndSubcategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductFilters,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/filters', getProductFilters);
router.get('/slug/:slug', getProductBySlug);
router.get('/category/:category/subcategory/:subcategory', getProductsByCategoryAndSubcategory);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
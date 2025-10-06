import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

async function recalculateProductRating(productIdentifier) {
  try {
    if (!productIdentifier) return;
    let product = null;
    
    // Try to find product by different methods
    if (typeof productIdentifier === 'string' && /^[a-fA-F0-9]{24}$/.test(productIdentifier)) {
      // MongoDB ObjectId
      product = await Product.findById(productIdentifier);
    } else if (typeof productIdentifier === 'string') {
      // Try by custom id, slug, or name
      product = await Product.findOne({ 
        $or: [
          { id: productIdentifier },
          { slug: productIdentifier }, 
          { name: productIdentifier }
        ] 
      });
    } else {
      product = await Product.findById(productIdentifier);
    }
    
    if (!product) {
      console.log(`Product not found for identifier: ${productIdentifier}`);
      return;
    }
    
    // Count reviews for this product (by both product._id and productName)
    const match = { 
      $or: [
        { product: product._id }, 
        { productName: product.name }
      ] 
    };
    
    const agg = await Review.aggregate([
      { $match: match },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    
    const avg = agg.length ? Number(agg[0].avg.toFixed(2)) : 0;
    const total = await Review.countDocuments(match);
    
    console.log(`Updating product ${product.name}: rating=${avg}, reviewCount=${total}`);
    
    await Product.findByIdAndUpdate(product._id, { 
      rating: avg, 
      reviewCount: total 
    });
    
  } catch (error) {
    console.error('Error in recalculateProductRating:', error);
  }
}

// Create new review (allow multiple reviews per user per product)
export const upsertReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const { productId, productName, rating, text } = req.body;

    if ((!productId && !productName) || !rating || !text) {
      return res.status(400).json({ message: 'productId or productName, rating, and text are required' });
    }

    let product = null;
    if (productId) {
      // Try to find product in database, but don't fail if not found
      try {
        product = await Product.findById(productId).select('name');
      } catch (e) {
        // Product not found in database, that's okay - we'll use productName
        console.log('Product not found in database, using productName fallback');
      }
    }

    const review = new Review({
      product: productId || undefined,
      productName: product?.name || productName,
      user: userId,
      userName,
      rating: Number(rating),
      text,
    });

    await review.save();
    await recalculateProductRating(productId || productName);

    res.status(201).json({ message: 'Review saved', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// List reviews for a product (paginated)
export const listProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    let filter = {};
    if (typeof productId === 'string' && /^[a-fA-F0-9]{24}$/.test(productId)) {
      filter = { $or: [{ product: productId }] };
      const prod = await Product.findById(productId).select('name');
      if (prod?.name) filter.$or.push({ productName: prod.name });
    } else {
      // treat as slug or name
      const bySlugOrName = await Product.findOne({ $or: [{ slug: productId }, { name: productId }] }).select('name _id');
      if (bySlugOrName) {
        filter = { $or: [{ product: bySlugOrName._id }, { productName: bySlugOrName.name }] };
      } else {
        filter = { productName: productId };
      }
    }

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .populate('user', 'name'),
      Review.countDocuments(filter),
    ]);

    res.json({ reviews, page, pages: Math.ceil(total / pageSize), total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single review details by id
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// List reviews for the authenticated user
export const listUserReviews = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const pageSize = Number(limit) || 20;
    const pageNum = Number(page) || 1;
    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(pageSize * (pageNum - 1))
        .limit(pageSize),
      Review.countDocuments({ user: req.user._id }),
    ]);
    res.json({ reviews, page: pageNum, pages: Math.ceil(total / pageSize), total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// List ALL reviews for admin dashboard
export const listAllReviews = async (req, res) => {
  try {
    console.log('Admin reviews endpoint called by user:', req.user?.email, req.user?.role);
    
    const { limit = 50, page = 1 } = req.query;
    const pageSize = Number(limit) || 50;
    const pageNum = Number(page) || 1;
    
    const [reviews, total] = await Promise.all([
      Review.find({})
        .sort({ createdAt: -1 })
        .skip(pageSize * (pageNum - 1))
        .limit(pageSize)
        .populate('user', 'name email'),
      Review.countDocuments({}),
    ]);
    
    console.log(`Found ${total} reviews in database, returning ${reviews.length} reviews`);
    
    res.json({ reviews, page: pageNum, pages: Math.ceil(total / pageSize), total });
  } catch (error) {
    console.error('Error in listAllReviews:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



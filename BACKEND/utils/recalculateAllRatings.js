import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Rating Recalculation'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Recalculate ratings and review counts for all products
const recalculateAllRatings = async () => {
  try {
    console.log('🚀 Starting rating recalculation for all products...');
    
    // Get all products
    const products = await Product.find({}).select('_id name');
    console.log(`📊 Found ${products.length} products to process`);
    
    let updated = 0;
    
    for (const product of products) {
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
      
      // Update product with new rating and review count
      await Product.findByIdAndUpdate(product._id, { 
        rating: avg, 
        reviewCount: total 
      });
      
      if (total > 0) {
        console.log(`✅ Updated ${product.name}: rating=${avg}, reviewCount=${total}`);
        updated++;
      }
    }
    
    console.log(`🎉 Recalculation complete! Updated ${updated} products with reviews.`);
    
    // Show some examples
    const productsWithReviews = await Product.find({ reviewCount: { $gt: 0 } })
      .select('name rating reviewCount')
      .limit(10);
    
    console.log('\n📋 Products with reviews:');
    productsWithReviews.forEach(product => {
      console.log(`- ${product.name}: ${product.rating}⭐ (${product.reviewCount} reviews)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error recalculating ratings:', error);
    process.exit(1);
  }
};

// Run the recalculation
recalculateAllRatings();







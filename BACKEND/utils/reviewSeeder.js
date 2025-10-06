import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Review Seeding'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Sample reviews data - expanded to cover more products
const sampleReviews = [
  {
    productName: "Blue Pottery",
    rating: 5,
    text: "Absolutely beautiful! The craftsmanship is exceptional and it looks stunning in my living room.",
    userName: "Priya Sharma"
  },
  {
    productName: "Blue Pottery", 
    rating: 4,
    text: "Great quality pottery. Delivery was fast and packaging was excellent. Highly recommended!",
    userName: "Rajesh Kumar"
  },
  {
    productName: "Madhubani Paintings",
    rating: 5,
    text: "Authentic Madhubani art! The colors are vibrant and the storytelling is beautiful. Worth every penny.",
    userName: "Anita Devi"
  },
  {
    productName: "Madhubani Paintings",
    rating: 4,
    text: "Nice traditional artwork. Good for gifting purposes. The frame quality could be better.",
    userName: "Vikram Singh"
  },
  {
    productName: "Pashmina Shawl",
    rating: 5,
    text: "Super soft and warm! Perfect for winter. The quality is amazing and it's very lightweight.",
    userName: "Meera Patel"
  },
  {
    productName: "Pashmina Shawl",
    rating: 5,
    text: "Excellent quality pashmina. Very comfortable to wear and the texture is so smooth.",
    userName: "Deepak Gupta"
  },
  {
    productName: "Warli Paintings",
    rating: 4,
    text: "Beautiful tribal art! Love the simplicity and cultural significance. Great addition to my collection.",
    userName: "Kavita Joshi"
  },
  {
    productName: "Terracotta Pottery",
    rating: 4,
    text: "Good quality terracotta work. The earthy feel is amazing. Perfect for home decoration.",
    userName: "Suresh Reddy"
  },
  {
    productName: "Bamboo & Cane Crafts",
    rating: 4,
    text: "Eco-friendly and well-made bamboo products. Great for sustainable living. Good quality craftsmanship.",
    userName: "Anjali Verma"
  },
  {
    productName: "Bamboo & Cane Crafts",
    rating: 5,
    text: "Love these bamboo crafts! They are durable and add a natural touch to my home decor.",
    userName: "Rohit Mehta"
  },
  {
    productName: "Palm Leaf Handicrafts",
    rating: 4,
    text: "Beautiful traditional palm leaf work. The intricate designs are impressive. Good value for money.",
    userName: "Sunita Rao"
  },
  {
    productName: "Dhokra Art",
    rating: 5,
    text: "Authentic tribal metal art! The bronze work is exceptional. A true piece of Indian heritage.",
    userName: "Kiran Desai"
  },
  {
    productName: "Kalamkari Textiles",
    rating: 4,
    text: "Beautiful hand-painted textiles. The natural dyes and patterns are stunning. Great for home decor.",
    userName: "Pooja Nair"
  },
  {
    productName: "Chikankari Embroidery",
    rating: 5,
    text: "Exquisite Lucknowi embroidery! The delicate work is breathtaking. Perfect for special occasions.",
    userName: "Neha Agarwal"
  },
  {
    productName: "Bandhani Tie-Dye",
    rating: 4,
    text: "Vibrant colors and traditional tie-dye patterns. Good quality fabric and beautiful designs.",
    userName: "Ravi Patel"
  }
];

// Import sample reviews to database
const importSampleReviews = async () => {
  try {
    console.log('🚀 Starting sample review import...');
    
    // Clear existing reviews
    await Review.deleteMany();
    console.log('✅ Cleared existing reviews');
    
    const reviewsToInsert = [];
    
    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = sampleReviews[i];
      
      // Create or get a unique user for each review
      const userEmail = `reviewer${i + 1}@example.com`;
      let reviewUser = await User.findOne({ email: userEmail });
      if (!reviewUser) {
        reviewUser = new User({
          name: reviewData.userName,
          email: userEmail,
          password: 'hashedpassword123', // This would be hashed in real scenario
          role: 'user'
        });
        await reviewUser.save();
      }
      
      // Find the product by name
      const product = await Product.findOne({ name: reviewData.productName });
      
      if (product) {
        const review = {
          user: reviewUser._id,
          userName: reviewData.userName,
          product: product._id,
          productName: reviewData.productName,
          rating: reviewData.rating,
          text: reviewData.text,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        };
        reviewsToInsert.push(review);
      } else {
        console.log(`⚠️  Product not found: ${reviewData.productName}`);
      }
    }
    
    // Insert reviews
    if (reviewsToInsert.length > 0) {
      await Review.insertMany(reviewsToInsert);
      console.log(`✅ Imported ${reviewsToInsert.length} sample reviews successfully!`);
    }
    
    // Verify import
    const count = await Review.countDocuments();
    console.log(`📊 Total reviews in database: ${count}`);
    
    // Show imported reviews
    const reviews = await Review.find().populate('product', 'name').select('productName rating text userName');
    console.log('\n📋 Imported reviews:');
    reviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.productName} - ${review.rating}⭐ by ${review.userName}`);
      console.log(`   "${review.text.substring(0, 60)}..."`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing sample reviews:', error);
    process.exit(1);
  }
};

// Delete all reviews
const destroySampleReviews = async () => {
  try {
    await Review.deleteMany();
    console.log('✅ All reviews deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting reviews:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  destroySampleReviews();
} else {
  importSampleReviews();
}

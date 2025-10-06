import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Sample Product Seeding'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Sample products with unique IDs
const sampleProducts = [
  {
    id: "prod_asi_ind_madhubani_001",
    name: "Madhubani Paintings",
    slug: "madhubani-paintings",
    price: 1800,
    offer: 10,
    image: "https://www.madhubani-art.in/wp-content/uploads/2018/05/1-1.jpg",
    color: "Multicolor",
    rating: 4.8,
    size: ["Canvas"],
    material: "Handmade paper, cloth, natural dyes",
    famousPlace: "Mithila region, Bihar",
    about: "Bright storytelling art of gods, rituals, and nature. Passed down through generations.",
    benefits: [
      "Eco-friendly natural colors",
      "Preserves folklore & mythology",
      "Livelihood for women artisans",
      "One-of-a-kind art pieces",
      "Enhances home aesthetics"
    ],
    care: "Keep framed under glass, away from moisture. Handle gently, avoid folding.",
    description: "Bright storytelling art of gods, rituals, and nature. Passed down through generations.",
    category: "asia",
    subcategory: "India",
    stock: 25,
    reviewCount: 0
  },
  {
    id: "prod_asi_ind_bluepottery_002",
    name: "Blue Pottery",
    slug: "blue-pottery-jaipur",
    price: 2500,
    offer: 5,
    image: "https://i.pinimg.com/originals/f3/22/e2/f322e2353427e727cb504b323b751811.jpg",
    color: "Turquoise Blue",
    rating: 4.7,
    size: ["Decorative"],
    material: "Quartz stone powder, glass, Multani mitti, natural dyes",
    famousPlace: "Jaipur, Rajasthan",
    about: "Decorative bowls, tiles, vases with Persian-inspired motifs.",
    benefits: [
      "Eco-friendly, lead-free",
      "Adds elegance to interiors",
      "Lightweight yet durable",
      "Royal decorative art",
      "Export demand worldwide"
    ],
    care: "Fragile—wipe gently, avoid extreme heat/cold.",
    description: "Decorative bowls, tiles, vases with Persian-inspired motifs.",
    category: "asia",
    subcategory: "India",
    stock: 15,
    reviewCount: 0
  },
  {
    id: "prod_asi_ind_pashmina_003",
    name: "Pashmina Shawl",
    slug: "pashmina-shawls",
    price: 6500,
    offer: 12,
    image: "https://i.pinimg.com/originals/7f/0f/3f/7f0f3fa49f32b1e1a01475818be77d75.jpg",
    color: "Cream",
    rating: 4.9,
    size: ["One Size"],
    material: "Pure Pashmina wool from Changthangi goats",
    famousPlace: "Kashmir Valley",
    about: "Luxurious, lightweight shawls known for their warmth and softness.",
    benefits: [
      "Ultra-soft and warm",
      "Lightweight yet insulating",
      "Timeless fashion accessory",
      "Handwoven by artisans",
      "Natural fiber"
    ],
    care: "Dry clean only. Store in breathable fabric bags.",
    description: "Luxurious, lightweight shawls known for their warmth and softness.",
    category: "asia",
    subcategory: "India",
    stock: 8,
    reviewCount: 0
  },
  {
    id: "prod_asi_ind_silverring_004",
    name: "Elegant Crystal Silver Ring",
    slug: "elegant-crystal-silver-ring",
    price: 799,
    offer: 10,
    image: "https://i.pinimg.com/736x/92/b5/d3/92b5d321aa4bec931b7a4f2a547c2e60.jpg",
    color: "Silver",
    rating: 4.5,
    size: [6, 7, 8, 9],
    material: "Sterling Silver",
    care: "Avoid water and harsh chemicals, polish with soft cloth",
    description: "Shimmering crystal design with a sleek silver finish. Perfect for both casual wear and special occasions.",
    about: "Handcrafted silver ring with crystal embellishments",
    famousPlace: "Rajasthan",
    benefits: [
      "Hypoallergenic silver",
      "Adjustable sizing",
      "Elegant design",
      "Durable craftsmanship"
    ],
    category: "accessories",
    subcategory: "Rings",
    stock: 25,
    reviewCount: 0
  },
  {
    id: "prod_asi_ind_goldring_005",
    name: "Classic Silver Cut Star Ring",
    slug: "classic-silver-cut-star-ring",
    price: 1499,
    offer: 15,
    image: "https://i.pinimg.com/originals/7f/0f/3f/7f0f3fa49f32b1e1a01475818be77d75.jpg",
    color: "Silver",
    rating: 4.8,
    size: [5, 6, 7, 8],
    material: "Gold",
    care: "Store in a soft pouch, avoid direct sunlight and chemicals",
    description: "A timeless gold ring with a brilliant diamond cut. Adds a touch of luxury to your everyday style.",
    about: "Premium gold ring with star cut design",
    famousPlace: "Mumbai",
    benefits: [
      "Pure gold material",
      "Star cut design",
      "Luxury appeal",
      "Investment value"
    ],
    category: "accessories",
    subcategory: "Rings",
    stock: 15,
    reviewCount: 0
  }
];

// Import sample products to database
const importSampleProducts = async () => {
  try {
    console.log('🚀 Starting sample product import...');
    
    // Clear existing products
    await Product.deleteMany();
    console.log('✅ Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Imported ${sampleProducts.length} sample products successfully!`);
    
    // Verify import
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);
    
    // Show imported products
    const products = await Product.find().select('id name category subcategory');
    console.log('\n📋 Imported products:');
    products.forEach(product => {
      console.log(`- ${product.id}: ${product.name} (${product.category}/${product.subcategory})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing sample products:', error);
    process.exit(1);
  }
};

// Delete all products
const destroySampleProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('✅ All products deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting products:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  destroySampleProducts();
} else {
  importSampleProducts();
}







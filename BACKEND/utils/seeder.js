import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Import data from frontend
const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    });

    // Import frontend data
    // This is a placeholder - you would need to import and transform the data from Categorydata.jsx
    // For demonstration, we'll create a few sample products
    const sampleProducts = [
      {
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
        category: "accessories",
        subcategory: "Rings",
        stock: 25,
      },
      {
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
        category: "accessories",
        subcategory: "Rings",
        stock: 15,
      },
      {
        name: "Vintage Stone-Studded Ring",
        slug: "vintage-stone-studded-ring",
        price: 999,
        offer: 5,
        image: "https://tse2.mm.bing.net/th/id/OIP.EtLaQ38rouZranjqtQHqzwHaE8?pid=Api&P=0&h=180",
        color: "Mixed",
        rating: 4.2,
        size: [6, 7, 8],
        material: "Alloy with gemstones",
        care: "Avoid water, clean with soft brush",
        description: "Romantic couple rings where two halves create one heart. Elegant design for love that completes each other.",
        category: "accessories",
        subcategory: "Rings",
        stock: 20,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
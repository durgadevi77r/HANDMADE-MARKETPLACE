import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Product Seeding'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Function to generate unique product ID
const generateProductId = (category, subcategory, name, index) => {
  const categoryCode = category.substring(0, 3).toLowerCase();
  const subcategoryCode = subcategory.substring(0, 3).toLowerCase();
  const nameCode = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
  const paddedIndex = String(index).padStart(3, '0');
  return `prod_${categoryCode}_${subcategoryCode}_${nameCode}_${paddedIndex}`;
};

// Function to read and process categorydata
const processCategoryData = async () => {
  try {
    // Import the categorydata directly
    const categoryDataPath = path.resolve(process.cwd(), '../FRONTEND/src/Data/Categorydata.jsx');
    
    // Read the file and create a temporary module
    let categoryDataContent = fs.readFileSync(categoryDataPath, 'utf8');
    
    // Replace export default with module.exports for Node.js compatibility
    categoryDataContent = categoryDataContent.replace('export default', 'module.exports =');
    
    // Write to a temporary file
    const tempPath = path.join(process.cwd(), 'temp_categorydata.cjs');
    fs.writeFileSync(tempPath, categoryDataContent);
    
    // Import the temporary file using dynamic import
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const categoryData = require(tempPath);
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    const allProducts = [];
    const idCounters = {};
    
    // Process each category and subcategory
    Object.keys(categoryData).forEach(category => {
      Object.keys(categoryData[category]).forEach(subcategory => {
        const products = categoryData[category][subcategory];
        
        products.forEach(product => {
          // Ensure product has all required fields
          const baseName = product.name || 'product';
          const slugBase = (product.slug || baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'item';
          const key = `${category}|${subcategory}|${slugBase}`;
          const nextIndex = (idCounters[key] = (idCounters[key] || 0) + 1);
          const uniqueId = generateProductId(category, subcategory, baseName, nextIndex);
          const uniqueSlug = nextIndex > 1 ? `${slugBase}-${String(nextIndex).padStart(3,'0')}` : slugBase;

          const processedProduct = {
            id: product.id || uniqueId,
            name: baseName,
            slug: uniqueSlug,
            price: product.price || 0,
            offer: product.offer || 0,
            image: product.image || '',
            color: product.color || 'Mixed',
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            orderCount: product.orderCount || 0,
            size: product.size || ['One Size'],
            material: product.material || '',
            care: product.care || '',
            description: product.description || product.about || baseName,
            about: product.about || baseName,
            famousPlace: product.famousPlace || '',
            benefits: product.benefits || [],
            category: category,
            subcategory: subcategory,
            stock: product.stock || Math.floor(Math.random() * 50) + 10
          };
          
          allProducts.push(processedProduct);
        });
      });
    });
    
    return allProducts;
  } catch (error) {
    console.error('Error processing category data:', error);
    return [];
  }
};

// Import products to database
const importProducts = async () => {
  try {
    console.log('🚀 Starting product import process...');
    
    // Clear existing products
    await Product.deleteMany();
    console.log('✅ Cleared existing products');
    
    // Process category data
    const products = await processCategoryData();
    console.log(`📦 Found ${products.length} products to import`);
    
    if (products.length === 0) {
      console.log('❌ No products found to import');
      return;
    }
    
    // Insert products in batches
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await Product.insertMany(batch);
      imported += batch.length;
      console.log(`📥 Imported ${imported}/${products.length} products...`);
    }
    
    console.log('✅ All products imported successfully!');
    console.log(`📊 Total products in database: ${await Product.countDocuments()}`);
    
    // Show sample products
    const sampleProducts = await Product.find().limit(5);
    console.log('\n📋 Sample products:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.id}: ${product.name} (${product.category}/${product.subcategory})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing products:', error);
    process.exit(1);
  }
};

// Delete all products
const destroyProducts = async () => {
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
  destroyProducts();
} else {
  importProducts();
}

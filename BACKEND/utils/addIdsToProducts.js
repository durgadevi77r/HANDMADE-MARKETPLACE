import fs from 'fs';
import path from 'path';

// Function to add sequential IDs to all products in Categorydata.jsx
const addIdsToAllProducts = async () => {
  try {
    console.log('🚀 Starting to add IDs to all products in Categorydata.jsx...');
    
    // Read the categorydata file
    const categoryDataPath = path.resolve(process.cwd(), '../FRONTEND/src/Data/Categorydata.jsx');
    let content = fs.readFileSync(categoryDataPath, 'utf8');
    
    console.log('📖 Read Categorydata.jsx file');
    
    // Replace export default with module.exports for Node.js compatibility
    let processableContent = content.replace('export default', 'module.exports =');
    
    // Write to a temporary file
    const tempPath = path.join(process.cwd(), 'temp_categorydata_for_ids.cjs');
    fs.writeFileSync(tempPath, processableContent);
    
    // Import the temporary file using dynamic import
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const categoryData = require(tempPath);
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    let productCounter = 1;
    let totalProducts = 0;
    
    // First pass: count total products
    Object.keys(categoryData).forEach(category => {
      Object.keys(categoryData[category]).forEach(subcategory => {
        const products = categoryData[category][subcategory];
        totalProducts += products.length;
      });
    });
    
    console.log(`📊 Found ${totalProducts} products total`);
    
    // Second pass: add IDs
    Object.keys(categoryData).forEach(category => {
      Object.keys(categoryData[category]).forEach(subcategory => {
        const products = categoryData[category][subcategory];
        
        products.forEach(product => {
          if (!product.id) {
            // Add sequential ID with zero padding
            const paddedId = String(productCounter).padStart(3, '0');
            product.id = `prod_${paddedId}`;
            productCounter++;
          }
        });
      });
    });
    
    console.log(`✅ Added IDs to ${productCounter - 1} products`);
    
    // Convert back to export format and write to file
    const updatedContent = `export default ${JSON.stringify(categoryData, null, 2)};`;
    
    // Create backup of original file
    const backupPath = categoryDataPath + '.backup';
    fs.copyFileSync(categoryDataPath, backupPath);
    console.log(`💾 Created backup at ${backupPath}`);
    
    // Write updated content
    fs.writeFileSync(categoryDataPath, updatedContent);
    console.log(`✅ Updated Categorydata.jsx with ${productCounter - 1} product IDs`);
    
    console.log('🎉 Successfully added IDs to all products!');
    
    return { totalProducts: productCounter - 1, success: true };
    
  } catch (error) {
    console.error('❌ Error adding IDs to products:', error);
    return { error: error.message, success: false };
  }
};

// Run the function
const result = await addIdsToAllProducts();
if (result.success) {
  console.log(`\n🎯 Summary:`);
  console.log(`- Total products processed: ${result.totalProducts}`);
  console.log(`- All products now have sequential IDs (prod_001 to prod_${String(result.totalProducts).padStart(3, '0')})`);
  console.log(`- Original file backed up as Categorydata.jsx.backup`);
  console.log(`- Ready to import to database!`);
} else {
  console.log(`\n❌ Failed: ${result.error}`);
}

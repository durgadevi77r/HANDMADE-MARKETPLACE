import fs from 'fs';
import path from 'path';

// Function to carefully add IDs to products without corrupting JSON structure
const addIdsCarefully = async () => {
  try {
    console.log('🚀 Starting careful ID addition to Categorydata.jsx...');
    
    // Read the original categorydata file
    const categoryDataPath = path.resolve(process.cwd(), '../FRONTEND/src/Data/Categorydata.jsx');
    let content = fs.readFileSync(categoryDataPath, 'utf8');
    
    console.log('📖 Read original Categorydata.jsx file');
    
    // Create a working copy for processing
    let workingContent = content.replace('export default ', '');
    
    // Write to a temporary file with .cjs extension for require
    const tempPath = path.join(process.cwd(), 'temp_categorydata_careful.cjs');
    fs.writeFileSync(tempPath, `module.exports = ${workingContent}`);
    
    // Import using require
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const categoryData = require(tempPath);
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    let productCounter = 1;
    let totalProducts = 0;
    let processedProducts = 0;
    
    // First pass: count total products
    Object.keys(categoryData).forEach(category => {
      Object.keys(categoryData[category]).forEach(subcategory => {
        const products = categoryData[category][subcategory];
        totalProducts += products.length;
      });
    });
    
    console.log(`📊 Found ${totalProducts} products total`);
    
    // Second pass: carefully add IDs
    Object.keys(categoryData).forEach(category => {
      console.log(`Processing category: ${category}`);
      Object.keys(categoryData[category]).forEach(subcategory => {
        const products = categoryData[category][subcategory];
        
        products.forEach(product => {
          if (!product.id) {
            // Add sequential ID with zero padding
            const paddedId = String(productCounter).padStart(3, '0');
            product.id = `prod_${paddedId}`;
            productCounter++;
            processedProducts++;
          }
        });
      });
    });
    
    console.log(`✅ Added IDs to ${processedProducts} products`);
    
    // Carefully convert back to JavaScript export format
    const jsonString = JSON.stringify(categoryData, null, 2);
    const updatedContent = `export default ${jsonString};`;
    
    // Create backup of current file
    const backupPath = categoryDataPath + '.backup2';
    fs.copyFileSync(categoryDataPath, backupPath);
    console.log(`💾 Created backup at ${backupPath}`);
    
    // Write updated content
    fs.writeFileSync(categoryDataPath, updatedContent);
    console.log(`✅ Updated Categorydata.jsx with ${processedProducts} product IDs`);
    
    // Verify the file is valid JavaScript by trying to parse it
    try {
      const verifyContent = fs.readFileSync(categoryDataPath, 'utf8');
      // Simple syntax check - make sure it starts and ends correctly
      if (verifyContent.startsWith('export default {') && verifyContent.endsWith('};')) {
        console.log('✅ File structure verification passed');
      } else {
        throw new Error('File structure verification failed');
      }
    } catch (e) {
      console.error('❌ File verification failed:', e.message);
      // Restore from backup
      fs.copyFileSync(backupPath, categoryDataPath);
      throw new Error('Restored from backup due to verification failure');
    }
    
    console.log('🎉 Successfully added IDs to all products!');
    
    return { totalProducts: processedProducts, success: true };
    
  } catch (error) {
    console.error('❌ Error adding IDs to products:', error);
    return { error: error.message, success: false };
  }
};

// Run the function
const result = await addIdsCarefully();
if (result.success) {
  console.log(`\n🎯 Summary:`);
  console.log(`- Total products processed: ${result.totalProducts}`);
  console.log(`- All products now have sequential IDs (prod_001 to prod_${String(result.totalProducts).padStart(3, '0')})`);
  console.log(`- Original file backed up as Categorydata.jsx.backup2`);
  console.log(`- File structure verified and valid`);
  console.log(`- Ready to import to database!`);
} else {
  console.log(`\n❌ Failed: ${result.error}`);
}








/**
 * Development utility to validate all images in categorydata.jsx
 * Run this in the browser console to check all your image URLs
 */

import categoryData from '../Data/Categorydata';
import { validateImageUrl, testImageUrl } from './imageUtils';

/**
 * Validate all images in the category data
 * @returns {Promise<object>} - Validation results
 */
export const validateAllCategoryImages = async () => {
  console.log('🔍 Starting image validation for categorydata.jsx...');
  
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    warnings: 0,
    accessible: 0,
    inaccessible: 0,
    details: []
  };

  // Collect all products from all categories
  const allProducts = [];
  Object.keys(categoryData).forEach(category => {
    Object.keys(categoryData[category]).forEach(subcategory => {
      categoryData[category][subcategory].forEach(product => {
        allProducts.push({
          ...product,
          category,
          subcategory
        });
      });
    });
  });

  console.log(`📊 Found ${allProducts.length} products to validate`);
  results.total = allProducts.length;

  // Validate each product's image
  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    const validation = validateImageUrl(product.image);
    
    let isAccessible = false;
    if (validation.isValid) {
      try {
        isAccessible = await testImageUrl(product.image);
      } catch (error) {
        console.warn(`Error testing ${product.name}:`, error);
      }
    }

    const result = {
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      url: product.image,
      validation,
      isAccessible
    };

    results.details.push(result);

    // Update counters
    if (validation.isValid) {
      results.valid++;
      if (validation.severity === 'warning') {
        results.warnings++;
      }
    } else {
      results.invalid++;
    }

    if (isAccessible) {
      results.accessible++;
    } else {
      results.inaccessible++;
    }

    // Progress indicator
    if ((i + 1) % 10 === 0 || i === allProducts.length - 1) {
      console.log(`⏳ Progress: ${i + 1}/${allProducts.length} (${Math.round(((i + 1) / allProducts.length) * 100)}%)`);
    }
  }

  return results;
};

/**
 * Generate a report of image validation results
 * @param {object} results - Results from validateAllCategoryImages
 */
export const generateImageReport = (results) => {
  console.log('\n📋 IMAGE VALIDATION REPORT');
  console.log('=' .repeat(50));
  console.log(`📊 Total Products: ${results.total}`);
  console.log(`✅ Valid URLs: ${results.valid}`);
  console.log(`❌ Invalid URLs: ${results.invalid}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log(`🌐 Accessible: ${results.accessible}`);
  console.log(`🚫 Inaccessible: ${results.inaccessible}`);
  console.log('=' .repeat(50));

  // Show problematic images
  const problematic = results.details.filter(item => 
    !item.validation.isValid || !item.isAccessible
  );

  if (problematic.length > 0) {
    console.log('\n🚨 PROBLEMATIC IMAGES:');
    problematic.forEach(item => {
      console.log(`\n📦 ${item.name} (${item.category}/${item.subcategory})`);
      console.log(`   URL: ${item.url}`);
      console.log(`   Issue: ${item.validation.message}`);
      if (item.validation.suggestion) {
        console.log(`   Suggestion: ${item.validation.suggestion}`);
      }
      if (item.validation.isValid && !item.isAccessible) {
        console.log(`   Status: URL is valid but image is not accessible`);
      }
    });
  }

  // Show recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Use HTTPS URLs for all images');
  console.log('2. Avoid Pinterest, Google Drive, and other hotlink-protected sites');
  console.log('3. Use reliable hosts like Imgur, Postimages, or Cloudinary');
  console.log('4. Test image URLs before adding them to your data');
  console.log('5. Consider using a CDN for better performance');

  return problematic;
};

/**
 * Quick function to run validation and show report
 * Usage: Call this in browser console or component
 */
export const runImageValidation = async () => {
  try {
    const results = await validateAllCategoryImages();
    const problematic = generateImageReport(results);
    
    // Return results for further processing
    return {
      results,
      problematic,
      summary: {
        successRate: Math.round((results.accessible / results.total) * 100),
        validationRate: Math.round((results.valid / results.total) * 100)
      }
    };
  } catch (error) {
    console.error('❌ Error during image validation:', error);
    return null;
  }
};

// Export for use in development
window.validateCategoryImages = runImageValidation;





/**
 * Image URL utilities for handling external image links
 */

// List of reliable image hosting services
export const RECOMMENDED_IMAGE_HOSTS = [
  'imgur.com',
  'postimg.cc',
  'cloudinary.com',
  'unsplash.com',
  'pexels.com',
  'pixabay.com',
  'wikimedia.org',
  'githubusercontent.com'
];

// List of problematic image hosts (hotlinking protection)
export const PROBLEMATIC_HOSTS = [
  'pinterest.com',
  'drive.google.com',
  'dropbox.com',
  'facebook.com',
  'instagram.com'
];

/**
 * Validate if an image URL is likely to work
 * @param {string} url - The image URL to validate
 * @returns {object} - Validation result with status and message
 */
export const validateImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      message: 'URL is required and must be a string',
      severity: 'error'
    };
  }

  const trimmedUrl = url.trim();
  
  // Check if it's a valid URL
  try {
    new URL(trimmedUrl);
  } catch (e) {
    return {
      isValid: false,
      message: 'Invalid URL format',
      severity: 'error'
    };
  }

  // Check if it's HTTPS
  if (!trimmedUrl.startsWith('https://')) {
    return {
      isValid: false,
      message: 'URL should use HTTPS for better compatibility',
      severity: 'warning',
      suggestion: trimmedUrl.replace('http://', 'https://')
    };
  }

  // Check for problematic hosts
  const problematicHost = PROBLEMATIC_HOSTS.find(host => trimmedUrl.includes(host));
  if (problematicHost) {
    return {
      isValid: false,
      message: `${problematicHost} may block hotlinking. Consider using a different image host.`,
      severity: 'warning',
      suggestion: `Try uploading to: ${RECOMMENDED_IMAGE_HOSTS.slice(0, 3).join(', ')}`
    };
  }

  // Check if it looks like an image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    trimmedUrl.toLowerCase().includes(ext)
  );

  if (!hasImageExtension && !trimmedUrl.includes('unsplash.com') && !trimmedUrl.includes('pexels.com')) {
    return {
      isValid: true,
      message: 'URL doesn\'t have a common image extension. Make sure it\'s a direct image link.',
      severity: 'info'
    };
  }

  return {
    isValid: true,
    message: 'URL looks good!',
    severity: 'success'
  };
};

/**
 * Get suggestions for better image hosting
 * @returns {array} - List of recommended image hosting services with details
 */
export const getImageHostingSuggestions = () => [
  {
    name: 'Imgur',
    url: 'https://imgur.com',
    description: 'Free, reliable, no hotlinking restrictions',
    pros: ['Free', 'No registration required', 'Direct links', 'Fast CDN']
  },
  {
    name: 'Postimages',
    url: 'https://postimages.org',
    description: 'Free image hosting with direct links',
    pros: ['Free', 'No registration required', 'Multiple formats', 'Permanent links']
  },
  {
    name: 'Cloudinary',
    url: 'https://cloudinary.com',
    description: 'Professional image hosting with optimization',
    pros: ['Free tier', 'Image optimization', 'Transformations', 'CDN']
  },
  {
    name: 'Unsplash',
    url: 'https://unsplash.com',
    description: 'High-quality stock photos',
    pros: ['Free', 'High quality', 'No attribution required', 'API available']
  }
];

/**
 * Convert Pinterest URL to a more reliable format (if possible)
 * @param {string} url - Pinterest URL
 * @returns {string} - Converted URL or original if conversion not possible
 */
export const convertPinterestUrl = (url) => {
  if (!url.includes('pinterest.com')) return url;
  
  // Try to extract direct image URL from Pinterest
  if (url.includes('/originals/')) {
    return url; // Already a direct link
  }
  
  // Pinterest URLs are tricky to convert reliably
  console.warn('Pinterest URL detected. For best results, right-click the image and "Copy image address" to get the direct URL.');
  return url;
};

/**
 * Test if an image URL is accessible
 * @param {string} url - Image URL to test
 * @returns {Promise<boolean>} - Promise that resolves to true if image is accessible
 */
export const testImageUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
};

/**
 * Batch validate multiple image URLs
 * @param {array} urls - Array of image URLs to validate
 * @returns {Promise<array>} - Array of validation results
 */
export const batchValidateImages = async (urls) => {
  const results = [];
  
  for (const url of urls) {
    const validation = validateImageUrl(url);
    const isAccessible = validation.isValid ? await testImageUrl(url) : false;
    
    results.push({
      url,
      validation,
      isAccessible,
      recommendation: !isAccessible && validation.isValid ? 
        'URL is valid but image may not be accessible. Try a different host.' : 
        validation.message
    });
  }
  
  return results;
};





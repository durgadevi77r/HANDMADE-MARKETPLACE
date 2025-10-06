import React, { useState, useEffect } from 'react';

const ProductImage = ({ src, alt, className, style, showPlaceholder = true, instant = false, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Set up the image source when the component mounts or src changes
  useEffect(() => {
    if (src && src.trim() !== '') {
      setIsLoading(!instant);
      setImageError(false);
      
      // Build a safe, usable URL without breaking localhost or same-origin HTTP
      let finalUrl = src.trim();
      try {
        const absolute = new URL(finalUrl, window.location.origin);
        const isLocalhost = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(absolute.hostname);
        const sameHost = absolute.host === window.location.host;
        const pageIsHttps = window.location.protocol === 'https:';
        // Only upgrade to https if page is https AND target is not localhost/same host
        if (absolute.protocol === 'http:' && pageIsHttps && !isLocalhost && !sameHost) {
          absolute.protocol = 'https:';
        }
        finalUrl = absolute.href;
      } catch (_) {
        // keep as-is if URL parsing fails
      }
      
      // If instant, set the URL immediately and skip preloading/UI
      if (instant) {
        setImageSrc(finalUrl);
        setIsLoading(false);
        setRetryCount(0);
        return;
      }

      // Add cache-busting parameter to prevent browser caching issues
      const cacheBuster = `?_cb=${Date.now()}`;
      const urlWithCacheBuster = finalUrl.includes('?') 
        ? `${finalUrl}&_cb=${Date.now()}` 
        : `${finalUrl}${cacheBuster}`;
      
      // Create a new image to test loading
      const img = new Image();
      
      // Set a longer timeout for image loading
      const timeoutId = setTimeout(() => {
        if (isLoading && retryCount < MAX_RETRIES) {
          console.log(`Image load timeout, retrying (${retryCount + 1}/${MAX_RETRIES}): ${secureUrl}`);
          setRetryCount(prev => prev + 1);
          img.src = urlWithCacheBuster; // Try loading again
        } else if (retryCount >= MAX_RETRIES) {
          console.error(`Failed to load image after ${MAX_RETRIES} attempts: ${secureUrl}`);
          setImageError(true);
          setIsLoading(false);
        }
      }, 5000); // 5 second timeout
      
      img.onload = () => {
        clearTimeout(timeoutId);
        setImageSrc(finalUrl);
        setIsLoading(false);
        setRetryCount(0);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        console.error(`Failed to preload image: ${finalUrl}`);
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying image load (${retryCount + 1}/${MAX_RETRIES}): ${finalUrl}`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            img.src = urlWithCacheBuster; // Try loading again with slight delay
          }, 1000);
        } else {
          setImageError(true);
          setIsLoading(false);
        }
      };
      
      img.src = urlWithCacheBuster;
    } else {
      setImageSrc('');
      setImageError(true);
      setIsLoading(false);
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      setRetryCount(0);
    };
  }, [src, retryCount, instant]);
  
  // Handle image load error
  const handleImageError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    setImageError(true);
  };

  // Check if we have a valid image URL
  const hasValidImage = imageSrc && imageSrc.trim() !== '' && !imageError;

  return (
    <div style={{ position: 'relative', ...style }} className={className} data-image-status={isLoading ? 'loading' : (hasValidImage ? 'loaded' : 'error')}>
      {isLoading ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            color: '#6b7280',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '8px' }}>Loading...</div>
          <div style={{ width: '50px', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: '50%', 
                height: '100%', 
                backgroundColor: '#4f46e5',
                animation: 'loading-progress 1.5s infinite ease-in-out',
              }}
            />
          </div>
          <style>
            {`
              @keyframes loading-progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}
          </style>
        </div>
      ) : hasValidImage ? (
        <img
          src={imageSrc}
          alt={alt || 'Product image'}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0,
            transition: 'opacity 0.3s ease-in',
            animation: 'fade-in 0.3s forwards',
          }}
          onLoad={(e) => {
            e.target.style.opacity = 1;
          }}
          {...props}
        />
      ) : (
        showPlaceholder && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f9fa',
              color: '#6b7280',
              fontSize: '0.875rem',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            No Image Available
          </div>
        )
      )}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ProductImage;


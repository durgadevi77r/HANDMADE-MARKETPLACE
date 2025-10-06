import React, { useState } from 'react';
import ProductImage from './ProductImage';
import { validateImageUrl, testImageUrl } from '../utils/imageUtils';

const ImageTester = () => {
  const [testUrl, setTestUrl] = useState('');
  const [validation, setValidation] = useState(null);
  const [isAccessible, setIsAccessible] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    if (!testUrl.trim()) return;
    
    setTesting(true);
    const validationResult = validateImageUrl(testUrl);
    setValidation(validationResult);
    
    if (validationResult.isValid) {
      const accessible = await testImageUrl(testUrl);
      setIsAccessible(accessible);
    } else {
      setIsAccessible(null);
    }
    
    setTesting(false);
  };

  const getStatusColor = () => {
    if (!validation) return '#6b7280';
    if (!validation.isValid) return '#dc2626';
    if (validation.severity === 'warning') return '#f59e0b';
    if (isAccessible === false) return '#dc2626';
    if (isAccessible === true) return '#16a34a';
    return '#6b7280';
  };

  const getStatusText = () => {
    if (testing) return 'Testing...';
    if (!validation) return 'Enter a URL to test';
    if (!validation.isValid) return `Invalid: ${validation.message}`;
    if (isAccessible === null) return validation.message;
    if (isAccessible === false) return 'URL valid but image not accessible';
    if (isAccessible === true) return 'Image working perfectly!';
    return 'Unknown status';
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px',
      backgroundColor: '#f9fafb'
    }}>
      <h3 style={{ marginTop: 0, color: '#1f2937' }}>🧪 Image URL Tester</h3>
      <p style={{ color: '#6b7280', fontSize: '14px' }}>
        Test your image URLs before adding them to categorydata.jsx
      </p>
      
      <div style={{ marginBottom: '16px' }}>
        <input
          type="url"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="Paste your image URL here..."
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <button
        onClick={handleTest}
        disabled={!testUrl.trim() || testing}
        style={{
          padding: '10px 20px',
          backgroundColor: testing ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: testing ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        {testing ? 'Testing...' : 'Test Image URL'}
      </button>
      
      {validation && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px'
        }}>
          <div style={{ 
            color: getStatusColor(), 
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Status: {getStatusText()}
          </div>
          
          {validation.suggestion && (
            <div style={{ 
              color: '#f59e0b', 
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              💡 Suggestion: {validation.suggestion}
            </div>
          )}
          
          {testUrl && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                color: '#374151'
              }}>
                Preview:
              </div>
              <div style={{ 
                width: '200px', 
                height: '150px', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <ProductImage 
                  src={testUrl} 
                  alt="Test image"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <strong>💡 Quick Tips:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Use HTTPS URLs for better compatibility</li>
          <li>Avoid Pinterest and Google Drive links</li>
          <li>Try Imgur.com or Postimages.org for reliable hosting</li>
          <li>Make sure the URL ends with .jpg, .png, etc.</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageTester;





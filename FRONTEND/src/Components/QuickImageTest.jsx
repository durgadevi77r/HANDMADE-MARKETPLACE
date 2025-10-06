import React from 'react';
import ProductImage from './ProductImage';

const QuickImageTest = () => {
  const testUrl = "https://thegathershop.co.za/cdn/shop/files/beadeddollsgroup.jpg?v=1713968947";
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      margin: '10px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🧪 Quick Image Test - Beaded Dolls</h3>
      <p><strong>URL:</strong> {testUrl}</p>
      
      <div style={{ 
        width: '200px', 
        height: '200px', 
        border: '1px solid #ccc',
        margin: '10px 0'
      }}>
        <ProductImage 
          src={testUrl} 
          alt="Beaded Dolls Test"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <strong>Expected:</strong> Should show beaded dolls image<br/>
        <strong>If you see a square:</strong> There's still an issue with the ProductImage component
      </div>
    </div>
  );
};

export default QuickImageTest;





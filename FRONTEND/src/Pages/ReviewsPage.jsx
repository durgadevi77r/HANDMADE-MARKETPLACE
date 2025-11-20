import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const ReviewsPage = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await apiFetch(`/api/reviews/product/${encodeURIComponent(productSlug)}`);
        const data = await res.json();

        if (res.ok) {
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
          if (data.reviews?.length > 0) {
            setProductName(data.reviews[0].productName || 'Product');
          }
        } else {
          setError(data.message || 'Failed to load reviews');
        }
      } catch (e) {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [productSlug]);

  if (loading)
    return <div style={{ padding: 24, fontSize: 18 }}>Loading reviews...</div>;

  if (error)
    return <div style={{ padding: 24, color: '#dc2626', fontSize: 18 }}>{error}</div>;

  return (
    <div 
      style={{ 
        padding: 24, 
        maxWidth: 900, 
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: '#f3f4f6',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        ← Back
      </button>

      {/* Title */}
      <h1 
        style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          marginBottom: 6 
        }}
      >
        Reviews for {productName} 
      </h1>

      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
      </p>

      <hr
        style={{
          margin: '20px 0',
          border: 'none',
          borderTop: '1px solid #e5e7eb'
        }}
      />

      {/* No Reviews */}
      {reviews.length === 0 ? (
        <p style={{ fontSize: 16, color: '#6b7280' }}>
          No reviews yet for this product.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {reviews.map((review, idx) => (
            <div
              key={review._id || idx}
              style={{
                padding: 20,
                borderRadius: 12,
                background: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid #f3f4f6'
              }}
            >
              {/* Stars + Name */}
              <div
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  marginBottom: 10 
                }}
              >
                <span style={{ color: '#f59e0b', fontSize: 20 }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>

                <strong style={{ fontSize: 16 }}>
                  {review.userName || 'Anonymous'}
                </strong>

                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9ca3af' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Review Text */}
              <p
                style={{
                  color: '#374151',
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;

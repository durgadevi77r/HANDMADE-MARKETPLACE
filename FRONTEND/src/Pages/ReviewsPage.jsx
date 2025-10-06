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
          if (data.reviews && data.reviews.length > 0) {
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

  if (loading) return <div style={{ padding: 16 }}>Loading reviews...</div>;
  if (error) return <div style={{ padding: 16, color: '#dc2626' }}>{error}</div>;

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Back</button>
      <h1>Reviews for {productName || 'Product'} ({reviews.length})</h1>
      <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
      
      {reviews.length === 0 ? (
        <p>No reviews yet for this product.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map((review, idx) => (
            <div key={review._id || idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ color: '#f59e0b', fontSize: '18px' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <strong style={{ fontSize: '16px' }}>{review.userName || 'Anonymous'}</strong>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  – "{review.text}"
                </span>
                <span style={{ color: '#6b7280', fontSize: '12px', marginLeft: 'auto' }}>
                  ({new Date(review.createdAt).toLocaleDateString()})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;

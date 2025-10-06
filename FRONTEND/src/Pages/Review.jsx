import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const Review = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const initialName = params.get('name') || '';
  const initialId = params.get('id') || '';
  const back = params.get('back') || '/';

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) navigate('/login');
  }, [navigate]);

  const submit = async () => {
    setError('');
    if (!rating || !text.trim()) {
      setError('Please select a rating and write a review.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: initialId || undefined, productName: initialName || undefined, rating, text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <button onClick={() => navigate(back)} style={{ marginBottom: 12 }}>← Back</button>
      <h1>Review {initialName || 'Product'}</h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <span>Rating:</span>
        {[1,2,3,4,5].map((s) => (
          <button key={s} onClick={() => setRating(s)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 28, color: s <= rating ? '#f59e0b' : '#ddd' }}>★</span>
          </button>
        ))}
        <span style={{ marginLeft: 8, color: '#666' }}>{rating || 0}/5</span>
      </div>
      <textarea
        placeholder="Share your experience"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: '100%', marginTop: 8 }}
      />
      {error && <div style={{ color: '#dc2626', marginTop: 8 }}>{error}</div>}
      <button onClick={submit} disabled={submitting} style={{ marginTop: 12 }}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
};

export default Review;



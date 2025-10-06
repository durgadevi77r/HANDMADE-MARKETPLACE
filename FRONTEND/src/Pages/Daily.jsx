import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const Daily = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const res = await apiFetch(`/api/products?date=${encodeURIComponent(date)}&limit=100`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      const list = data.products || data || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Products by Date</h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={load}>Show</button>
      </div>
      {error && <div style={{ color: '#dc2626' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {items.map((p) => (
          <Link key={p._id} to={`/category/${p.category || 'category'}/${p.subcategory || 'subcategory'}/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit', border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 6, background: '#fafafa' }}>
              <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>{p.name}</div>
            <div style={{ marginTop: 4 }}>₹{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Daily;



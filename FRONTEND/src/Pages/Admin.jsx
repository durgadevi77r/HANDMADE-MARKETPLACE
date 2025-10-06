import React, { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';
import './Admin.css'

const Admin = () => {
  const [filters, setFilters] = useState({ date: '', month: '', year: '', from: '', to: '' });
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [productTotal, setProductTotal] = useState(0);
  const [productSearch, setProductSearch] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [reviewsSearch, setReviewsSearch] = useState('');
  const productSearchRef = useRef(null);
  const ordersSearchRef = useRef(null);
  const reviewsSearchRef = useRef(null);
  const debounceTimer = useRef(null);

  const load = async () => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      console.log('Admin dashboard loading data with token:', token ? 'Present' : 'Missing');
      
      // Load orders report
      const qs = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))).toString();
      const res = await apiFetch(`/api/admin/reports${qs ? `?${qs}` : ''}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load report');
      setReport(data);
      console.log('Orders loaded:', data.orders?.length || 0);
      
      // Load all reviews for admin view
      const reviewsRes = await apiFetch('/api/admin/reviews', { headers: { Authorization: `Bearer ${token}` } });
      const reviewsData = await reviewsRes.json();
      if (reviewsRes.ok) {
        const reviewsArray = Array.isArray(reviewsData.reviews) ? reviewsData.reviews : [];
        setReviews(reviewsArray);
        console.log('Reviews loaded:', reviewsArray.length);
      } else {
        console.error('Reviews failed:', reviewsData);
      }
      
      // Load all products (single page, large limit)
      const searchParam = productSearch ? `&search=${encodeURIComponent(productSearch)}` : '';
      const productsRes = await apiFetch(`/api/products?limit=10000&page=1${searchParam}`, { headers: { Authorization: `Bearer ${token}` } });
      const productsData = await productsRes.json();
      if (productsRes.ok) {
        const productsArray = Array.isArray(productsData.products) ? productsData.products : [];
        setProducts(productsArray);
        setProductTotal(productsData.total || productsArray.length);
        console.log('Products loaded:', productsArray.length, 'of', productsData.total);
      } else {
        console.error('Products failed:', productsData);
      }
      
      // Load all users
      const usersRes = await apiFetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      const usersData = await usersRes.json();
      if (usersRes.ok) {
        const usersArray = Array.isArray(usersData) ? usersData : [];
        setUsers(usersArray);
        console.log('Users loaded:', usersArray.length);
      } else {
        console.error('Users failed:', usersData);
      }
      
      // Load all wishlists
      const wishlistsRes = await apiFetch('/api/admin/wishlists', { headers: { Authorization: `Bearer ${token}` } });
      const wishlistsData = await wishlistsRes.json();
      if (wishlistsRes.ok) {
        const wishlistsArray = Array.isArray(wishlistsData.wishlists) ? wishlistsData.wishlists : [];
        setWishlists(wishlistsArray);
        console.log('Wishlists loaded:', wishlistsArray.length);
      } else {
        console.error('Wishlists failed:', wishlistsData);
      }
    } catch (e) {
      console.error('Admin dashboard load error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Debounced product search that keeps focus in the input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (activeTab === 'products') {
        load();
        // keep cursor in the search bar
        if (productSearchRef.current) productSearchRef.current.focus();
      }
    }, 300);
    return () => debounceTimer.current && clearTimeout(debounceTimer.current);
  }, [productSearch]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div style={{ marginBottom: 24, borderBottom: '2px solid #e5e7eb', position: 'sticky', top: 0, background: 'linear-gradient(90deg,#f8fafc,#ffffff)', zIndex: 5 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { key: 'orders', label: `Orders (${report?.totals?.orders || 0})`, icon: '📦' },
            { key: 'products', label: `Products (${products.length})`, icon: '🛍️' },
            { key: 'users', label: `Users (${users.length})`, icon: '👥' },
            { key: 'reviews', label: `Reviews (${reviews.length})`, icon: '⭐' },
            { key: 'wishlists', label: `Wishlists (${wishlists.length})`, icon: '❤️' }
          ].map(tab => (
        <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
          style={{ 
                padding: '12px 20px',
            border: 'none',
                borderBottom: activeTab === tab.key ? '3px solid #3b82f6' : '3px solid transparent',
                background: activeTab === tab.key ? '#eff6ff' : 'transparent',
                color: activeTab === tab.key ? '#1d4ed8' : '#6b7280',
                cursor: 'pointer',
                fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              {tab.icon} {tab.label}
        </button>
          ))}
        </div>
      </div>
      
      {error && <div style={{ color: '#dc2626', marginBottom: 16, padding: 12, background: '#fef2f2', borderRadius: 8 }}>{error}</div>}
      
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          <div style={{ fontSize: '18px', marginBottom: 8 }}>🔄 Loading Admin Data...</div>
          <div style={{ fontSize: '14px' }}>Fetching products, users, reviews, and wishlists...</div>
        </div>
      )}

      {/* Tab Content - Only show when not loading */}
      {!loading && activeTab === 'orders' && (
        <div>
        <h2>Orders Report</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <input
            ref={ordersSearchRef}
            placeholder="Search orders (name, email, product)"
            value={ordersSearch}
            onChange={(e) => setOrdersSearch(e.target.value)}
            style={{ padding: 8, minWidth: 280 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <input placeholder="Date (1-31)" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          <input placeholder="Month (1-12)" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} />
          <input placeholder="Year" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
          <input placeholder="From (YYYY-MM-DD)" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <input placeholder="To (YYYY-MM-DD)" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
            <button onClick={load} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Filter</button>
        </div>
        {report && (
          <div>
              <div style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
              <strong>Totals</strong>: Orders {report.totals?.orders} • Subtotal ₹{report.totals?.subtotalAmount?.toFixed?.(2)} • Discount ₹{report.totals?.discountAmount?.toFixed?.(2)} • Total ₹{report.totals?.totalAmount?.toFixed?.(2)}
            </div>
            <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8,}}>
                <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>User Info</th>
                      <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Order Time</th>
                      <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Products</th>
                      <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Payment</th>
                      <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.orders?.filter((o) => {
                    const q = ordersSearch.toLowerCase();
                    if (!q) return true;
                    const products = (o.items || []).map(i => (i.name || '')).join(' ').toLowerCase();
                    return (
                      (o.userName || '').toLowerCase().includes(q) ||
                      (o.deliveryDetails?.email || '').toLowerCase().includes(q) ||
                      products.includes(q)
                    );
                  }).map((o) => (
                    <tr key={o.id}>
                        <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                        <div><strong>Name:</strong> {o.userName}</div>
                        <div><strong>Email:</strong> {o.deliveryDetails?.email || 'N/A'}</div>
                        <div><strong>Phone:</strong> {o.deliveryDetails?.phone1 || 'N/A'}</div>
                        <div><strong>Address:</strong> {o.deliveryDetails?.address || 'N/A'}</div>
                      </td>
                        <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>{new Date(o.orderTime).toLocaleString()}</td>
                        <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                        {o.items?.map((i, idx) => (
                          <div key={idx} style={{ marginBottom: 4 }}>
                            <div><strong>{i.name}</strong></div>
                            <div>Qty: {i.quantity} × ₹{i.amount?.toFixed(2)} = ₹{((i.amount || 0) * (i.quantity || 0)).toFixed(2)}</div>
                          </div>
                        ))}
                      </td>
                        <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                        <div><strong>Method:</strong> {o.paymentMode}</div>
                        <div><strong>Subtotal:</strong> ₹{o.subtotalAmount?.toFixed(2)}</div>
                        <div><strong>Discount:</strong> ₹{o.discountAmount?.toFixed(2)}</div>
                      </td>
                        <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{(o.totalAmount ?? 0).toFixed(2)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Products Tab */}
      {!loading && activeTab === 'products' && (
        <div>
          <h2>All Products ({productTotal})</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <input
              ref={productSearchRef}
              placeholder="Search by name, description, category..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              style={{ padding: 10, minWidth: 300, border: '1px solid #cbd5e1', borderRadius: 8 }}
            />
            {productSearch && (
              <button onClick={() => { setProductSearch(''); if (productSearchRef.current) productSearchRef.current.focus(); }} style={{ padding: '8px 12px' }}>Clear</button>
            )}
          </div>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>ID</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Name</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Category</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Price</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Offer</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Stock</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Reviews</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Orders</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product._id || idx}>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12, fontSize: '12px', color: '#6b7280' }}>{product.id || product._id}</td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{product.material}</div>
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      <div>{product.category}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{product.subcategory}</div>
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>₹{product.price}</td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      {product.offer > 0 ? `${product.offer}% OFF` : 'No Offer'}
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        fontSize: '12px',
                        background: (product.stock || 0) > 0 ? '#dcfce7' : '#fee2e2',
                        color: (product.stock || 0) > 0 ? '#166534' : '#dc2626'
                      }}>
                        {product.stock || 0} units
                      </span>
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      <div>{product.reviewCount || 0} reviews</div>
                      <div style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</div>
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>{product.orderCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {!loading && activeTab === 'users' && (
        <div>
          <h2>All Users ({users.length})</h2>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Name</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Email</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Role</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Joined</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', padding: 12 }}>Wishlist</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id || idx}>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>{user.email}</td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        fontSize: '12px',
                        background: user.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                        color: user.role === 'admin' ? '#1d4ed8' : '#374151'
                      }}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ borderBottom: '1px solid #f1f5f9', padding: 12 }}>
                      {user.wishlist?.length || 0} items
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {!loading && activeTab === 'reviews' && (
        <div>
          <h2>All Reviews ({reviews.length})</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input
              ref={reviewsSearchRef}
              placeholder="Search reviews (user, product, text)"
              value={reviewsSearch}
              onChange={(e) => setReviewsSearch(e.target.value)}
              style={{ padding: 8, minWidth: 280 }}
            />
          </div>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {reviews.filter((r) => {
              const q = reviewsSearch.toLowerCase();
              if (!q) return true;
              return (
                (r.userName || '').toLowerCase().includes(q) ||
                (r.productName || '').toLowerCase().includes(q) ||
                (r.text || '').toLowerCase().includes(q)
              );
            }).map((review, idx) => (
              <div key={review._id || idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12, background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ color: '#1f2937' }}>{review.userName || 'Anonymous'}</strong>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ color: '#f59e0b', marginBottom: 8, fontSize: '16px' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} ({review.rating}/5)
                </div>
                <div style={{ marginBottom: 4 }}><strong>Product:</strong> {review.productName}</div>
                <div style={{ color: '#4b5563', lineHeight: '1.5' }}><strong>Review:</strong> {review.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlists Tab */}
      {!loading && activeTab === 'wishlists' && (
        <div>
          <h2>User Wishlists ({wishlists.length})</h2>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {wishlists.map((wishlist, idx) => (
              <div key={wishlist.userId || idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12, background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{wishlist.userName}</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{wishlist.userEmail}</div>
                  </div>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: 20, 
                    fontSize: '12px',
                    background: '#fef3c7',
                    color: '#92400e'
                  }}>
                    {wishlist.itemCount} items
                  </span>
                </div>
                {wishlist.wishlistItems && wishlist.wishlistItems.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    {wishlist.wishlistItems.map((item, itemIdx) => (
                      <div key={item._id || itemIdx} style={{ border: '1px solid #f3f4f6', borderRadius: 6, padding: 8 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: 4 }}>{item.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '12px' }}>₹{item.price}</div>
                        <div style={{ color: '#6b7280', fontSize: '12px' }}>{item.category} → {item.subcategory}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>No items in wishlist</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;



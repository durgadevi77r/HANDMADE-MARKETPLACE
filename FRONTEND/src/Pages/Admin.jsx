import React, { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';
import './Admin.css';

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
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </header>
      
      {/* Tab Navigation */}
      <nav className="admin-nav">
        <div className="nav-tabs">
          {[
            { key: 'orders', label: `Orders (${report?.totals?.orders || 0})`, icon: '📦' },
            { key: 'products', label: `Products (${products.length})`, icon: '🛍️' },
            { key: 'users', label: `Users (${users.length})`, icon: '👥' },
            { key: 'reviews', label: `Reviews (${reviews.length})`, icon: '⭐' },
            // { key: 'wishlists', label: `Wishlists (${wishlists.length})`, icon: '❤️' }
          ].map(tab => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`nav-tab ${activeTab === tab.key ? 'nav-tab--active' : ''}`}
            >
              <span className="nav-tab-icon">{tab.icon}</span>
              <span className="nav-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
      
      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Admin Data...</div>
          <div className="loading-subtext">Fetching products, users, reviews, and wishlists...</div>
        </div>
      )}

      {/* Tab Content - Only show when not loading */}
      {!loading && activeTab === 'orders' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2 className="tab-title">Orders Report</h2>
            <div className="search-container">
              <input
                ref={ordersSearchRef}
                placeholder="Search orders (name, email, product)"
                value={ordersSearch}
                onChange={(e) => setOrdersSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-container">
            <div className="filters-grid">
              <input 
                placeholder="Date (1-31)" 
                value={filters.date} 
                onChange={(e) => setFilters({ ...filters, date: e.target.value })} 
                className="filter-input"
              />
              <input 
                placeholder="Month (1-12)" 
                value={filters.month} 
                onChange={(e) => setFilters({ ...filters, month: e.target.value })} 
                className="filter-input"
              />
              <input 
                placeholder="Year" 
                value={filters.year} 
                onChange={(e) => setFilters({ ...filters, year: e.target.value })} 
                className="filter-input"
              />
              <input 
                placeholder="From (YYYY-MM-DD)" 
                value={filters.from} 
                onChange={(e) => setFilters({ ...filters, from: e.target.value })} 
                className="filter-input"
              />
              <input 
                placeholder="To (YYYY-MM-DD)" 
                value={filters.to} 
                onChange={(e) => setFilters({ ...filters, to: e.target.value })} 
                className="filter-input"
              />
              <button onClick={load} className="filter-button">
                Apply Filters
              </button>
            </div>
          </div>
          
          {report && (
            <div className="report-container">
              <div className="summary-card">
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Total Orders</span>
                    <span className="summary-value">{report.totals?.orders}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">₹{report.totals?.subtotalAmount?.toFixed?.(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Discount</span>
                    <span className="summary-value discount">₹{report.totals?.discountAmount?.toFixed?.(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Amount</span>
                    <span className="summary-value total">₹{report.totals?.totalAmount?.toFixed?.(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="table-container">
                <table className="data-table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-cell">User Information</th>
                      <th className="table-cell">Order Time</th>
                      <th className="table-cell">Products</th>
                      <th className="table-cell">Payment Details</th>
                      <th className="table-cell">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
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
                      <tr key={o.id} className="table-row">
                        <td className="table-cell">
                          <div className="user-info">
                            <div className="info-item">
                              <strong>Name:</strong> {o.userName}
                            </div>
                            <div className="info-item">
                              <strong>Email:</strong> {o.deliveryDetails?.email || 'N/A'}
                            </div>
                            <div className="info-item">
                              <strong>Phone:</strong> {o.deliveryDetails?.phone1 || 'N/A'}
                            </div>
                            <div className="info-item">
                              <strong>Address:</strong> {o.deliveryDetails?.address || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="order-time">
                            {new Date(o.orderTime).toLocaleString()}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="products-list">
                            {o.items?.map((i, idx) => (
                              <div key={idx} className="product-item">
                                <div className="product-name">{i.name}</div>
                                <div className="product-quantity">
                                  Qty: {i.quantity} × ₹{i.amount?.toFixed(2)} = ₹{((i.amount || 0) * (i.quantity || 0)).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="payment-info">
                            <div className="payment-item">
                              <strong>Method:</strong> {o.paymentMode}
                            </div>
                            <div className="payment-item">
                              <strong>Subtotal:</strong> ₹{o.subtotalAmount?.toFixed(2)}
                            </div>
                            <div className="payment-item">
                              <strong>Discount:</strong> ₹{o.discountAmount?.toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="total-amount">
                            ₹{(o.totalAmount ?? 0).toFixed(2)}
                          </div>
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
        <div className="tab-content">
          <div className="tab-header">
            <h2 className="tab-title">All Products ({productTotal})</h2>
            <div className="search-container">
              <input
                ref={productSearchRef}
                placeholder="Search by name, description, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="search-input"
              />
              {productSearch && (
                <button 
                  onClick={() => { 
                    setProductSearch(''); 
                    if (productSearchRef.current) productSearchRef.current.focus(); 
                  }} 
                  className="clear-button"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Product Details</th>
                  <th className="table-cell">Category</th>
                  <th className="table-cell">Price</th>
                  <th className="table-cell">Offer</th>
                  <th className="table-cell">Stock Status</th>
                  <th className="table-cell">Reviews</th>
                  <th className="table-cell">Orders</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {products.map((product, idx) => (
                  <tr key={product._id || idx} className="table-row">
                    <td className="table-cell product-id">
                      {product.id || product._id}
                    </td>
                    <td className="table-cell">
                      <div className="product-details">
                        <div className="product-name">{product.name}</div>
                        <div className="product-material">{product.material}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="category-info">
                        <div className="category-name">{product.category}</div>
                        <div className="subcategory-name">{product.subcategory}</div>
                      </div>
                    </td>
                    <td className="table-cell product-price">
                      ₹{product.price}
                    </td>
                    <td className="table-cell">
                      <span className={`offer-badge ${product.offer > 0 ? 'offer-active' : ''}`}>
                        {product.offer > 0 ? `${product.offer}% OFF` : 'No Offer'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`stock-badge ${(product.stock || 0) > 0 ? 'stock-in' : 'stock-out'}`}>
                        {product.stock || 0} units
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="review-info">
                        <div className="review-count">{product.reviewCount || 0} reviews</div>
                        <div className="rating-stars">
                          {'★'.repeat(Math.round(product.rating || 0))}
                          {'☆'.repeat(5 - Math.round(product.rating || 0))}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell order-count">
                      {product.orderCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {!loading && activeTab === 'users' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2 className="tab-title">All Users ({users.length})</h2>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell">Name</th>
                  <th className="table-cell">Email</th>
                  <th className="table-cell">Role</th>
                  <th className="table-cell">Joined Date</th>
                  <th className="table-cell">Wishlist Items</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user, idx) => (
                  <tr key={user._id || idx} className="table-row">
                    <td className="table-cell">
                      <div className="user-name">{user.name}</div>
                    </td>
                    <td className="table-cell user-email">
                      {user.email}
                    </td>
                    <td className="table-cell">
                      <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="table-cell join-date">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="table-cell">
                      <span className="wishlist-count">
                        {user.wishlist?.length || 0} items
                      </span>
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
        <div className="tab-content">
          <div className="tab-header">
            <h2 className="tab-title">All Reviews ({reviews.length})</h2>
            <div className="search-container">
              <input
                ref={reviewsSearchRef}
                placeholder="Search reviews (user, product, text)"
                value={reviewsSearch}
                onChange={(e) => setReviewsSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="reviews-grid">
            {reviews.filter((r) => {
              const q = reviewsSearch.toLowerCase();
              if (!q) return true;
              return (
                (r.userName || '').toLowerCase().includes(q) ||
                (r.productName || '').toLowerCase().includes(q) ||
                (r.text || '').toLowerCase().includes(q)
              );
            }).map((review, idx) => (
              <div key={review._id || idx} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong className="reviewer-name">{review.userName || 'Anonymous'}</strong>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="rating-container">
                  <div className="rating-stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <span className="rating-value">({review.rating}/5)</span>
                </div>
                <div className="review-product">
                  <strong>Product:</strong> {review.productName}
                </div>
                <div className="review-text">
                  <strong>Review:</strong> {review.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlists Tab
      {!loading && activeTab === 'wishlists' && (
        <div className="tab-content">
          <div className="tab-header">
            <h2 className="tab-title">User Wishlists ({wishlists.length})</h2>
          </div>
          
          <div className="wishlists-grid">
            {wishlists.map((wishlist, idx) => (
              <div key={wishlist.userId || idx} className="wishlist-card">
                <div className="wishlist-header">
                  <div className="wishlist-user">
                    <div className="user-name">{wishlist.userName}</div>
                    <div className="user-email">{wishlist.userEmail}</div>
                  </div>
                  <span className="wishlist-count-badge">
                    {wishlist.itemCount} items
                  </span>
                </div>
                {wishlist.wishlistItems && wishlist.wishlistItems.length > 0 ? (
                  <div className="wishlist-items">
                    {wishlist.wishlistItems.map((item, itemIdx) => (
                      <div key={item._id || itemIdx} className="wishlist-item">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">₹{item.price}</div>
                        <div className="item-category">{item.category} → {item.subcategory}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-wishlist">No items in wishlist</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Admin;
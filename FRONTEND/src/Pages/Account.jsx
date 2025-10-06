import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import "./Account.css"; 

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([
      apiFetch("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      apiFetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => []),
      apiFetch("/api/reviews", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => ({})),
    ])
      .then(([user, ordersResult, userReviews]) => {
        setProfile(user);
        setOrders(Array.isArray(ordersResult) ? ordersResult : []);
        setReviews(Array.isArray(userReviews?.reviews) ? userReviews.reviews : []);
      })
      .catch(() => setError("Failed to load account"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setProfile({ ...profile, address: { ...(profile.address || {}), [key]: value } });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    setSaving(true);
    apiFetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: profile.name,
        email: profile.email,
        address: profile.address,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setIsEditing(false);
        alert("Profile updated");
      })
      .catch(() => alert("Failed to update"))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!profile) return <div className="login-prompt">Please log in to view your account.</div>;

  return (
    <div className="account-container">
      <div className="account-header">
        <h1 className="account-title">My Account</h1>
        <button 
          onClick={() => setIsEditing((v) => !v)} 
          className={`edit-toggle-btn ${isEditing ? 'editing' : ''}`}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <div className="account-grid">
        <div>
          <div className="profile-section">
            <div className="profile-form">
              <label className="form-label">
                <div>Username</div>
                <input 
                  name="name" 
                  value={profile.name || ""} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                <div>Email</div>
                <input 
                  name="email" 
                  value={profile.email || ""} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  className="form-input"
                />
              </label>
              <fieldset className="address-fieldset">
                <legend className="address-legend">Address</legend>
                <div className="address-grid">
                  <label className="form-label">
                    <div>Street</div>
                    <input 
                      name="address.street" 
                      value={profile.address?.street || ""} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    <div>City</div>
                    <input 
                      name="address.city" 
                      value={profile.address?.city || ""} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    <div>State</div>
                    <input 
                      name="address.state" 
                      value={profile.address?.state || ""} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    <div>Postal Code</div>
                    <input 
                      name="address.postalCode" 
                      value={profile.address?.postalCode || ""} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    <div>Country</div>
                    <input 
                      name="address.country" 
                      value={profile.address?.country || ""} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </label>
                </div>
              </fieldset>
              {isEditing && (
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="save-btn"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="orders-section">
          <h2 className="orders-title">Order History</h2>
          {orders.length === 0 ? (
            <p className="no-orders">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-info">
                  <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</div>
                  <div><strong>Total:</strong> ₹{(order.finalAmount ?? order.totalAmount)?.toFixed(2)}</div>
                  <div><strong>Status:</strong> {order.status}</div>
                </div>
                <div className="order-items">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  {order.items?.map((item, idx) => {
                    const myReview = reviews.find((r) => r.productName === item.name);
                    return (
                      <div key={idx} style={{ fontSize: 13, padding: '6px 0', borderTop: '1px dashed #eee' }}>
                        {myReview ? (
                          <div>
                            <strong>Your review:</strong> <span style={{ color: '#f59e0b' }}>{'★'.repeat(myReview.rating)}{'☆'.repeat(5 - myReview.rating)}</span>
                            <div style={{ color: '#555' }}>{myReview.text}</div>
                          </div>
                        ) : (
                          <a href={`#/review?name=${encodeURIComponent(item.name)}&back=${encodeURIComponent('/account')}`}>Write a review for {item.name}</a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
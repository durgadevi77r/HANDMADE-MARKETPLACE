import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Components/Common.css";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login");
      return;
    }

    // Fetch cart items from local storage
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      const items = JSON.parse(storedCart);
      setCartItems(items);
      calculateTotal(items);
    }
    setLoading(false);
  }, [navigate]);

  const calculateTotal = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountAmount = subtotal > 1000 ? subtotal * 0.12 : 0; // 12% discount if over 1000
    const final = subtotal - discountAmount;
    
    setTotalPrice(subtotal);
    setDiscount(discountAmount);
    setFinalPrice(final);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-state">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-state">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">SHOPPING CART</h1>
        <span className="cart-items-count">{cartItems.length} ITEMS</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="items-header">
              <span>PRODUCT</span>
              <span>QUANTITY</span>
              <span>TOTAL</span>
              <span>ACTION</span>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <div className="item-image-section">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">${item.price}</p>
                      <div className="item-attributes">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="quantity-btn minus"
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="quantity-btn plus"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h3 className="summary-title">ORDER SUMMARY</h3>
              
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="price-row discount">
                  <span>Discount (12% OFF):</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="price-row total">
                  <span>Total:</span>
                  <span>₹{finalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={() => navigate("/")}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="checkout-btn"
                  disabled={cartItems.length === 0}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>

              {/* <div className="security-badge">
                <span>🔒 Secure Checkout • 🚚 Free Shipping • ↩️ Easy Returns</span>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
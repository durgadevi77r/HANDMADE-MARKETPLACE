import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { apiFetch } from "../utils/api";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [apiBase, setApiBase] = useState(() => localStorage.getItem("apiBase") || "http://localhost:5000");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const [lottieError, setLottieError] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    phone1: "",
    phone2: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");
  const [upiVerifying, setUpiVerifying] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);
  const [cardData, setCardData] = useState({ name: "", number: "", expiry: "", cvv: "", save: false });
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardPaid, setCardPaid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!showSuccess) return;
    setLottieLoaded(false);
    setLottieError(false);
    const t = setTimeout(() => {
      if (!lottieLoaded) setLottieError(true);
    }, 600);
    return () => clearTimeout(t);
  }, [showSuccess, lottieLoaded]);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login");
      return;
    }

    const resolveApiBase = async () => {
      const cached = localStorage.getItem("apiBase");
      const candidates = cached
        ? [cached]
        : [
          "http://localhost:5000",
          "http://localhost:5001",
          "http://localhost:5002",
          "http://localhost:5003",
          "http://localhost:5004",
          "http://localhost:5005",
        ];
      for (const base of candidates) {
        try {
          const res = await fetch(`${base}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (res.ok) {
            setApiBase(base);
            localStorage.setItem("apiBase", base);
            const profile = await res.json();
            if (profile && profile.name) {
              setForm((f) => ({
                ...f,
                name: profile.name || "",
                email: profile.email || "",
                address: profile.address?.street || f.address,
                district: profile.address?.city || f.district,
                state: profile.address?.state || f.state,
                pincode: profile.address?.postalCode || f.pincode,
              }));
            }
            return;
          }
        } catch (_) { }
      }
    };
    resolveApiBase();

    const storedCart = localStorage.getItem("cartItems");
    const items = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(items);
    const sub = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const disc = sub > 1000 ? sub * 0.12 : 0;
    const fin = sub - disc;
    setSubtotal(sub);
    setDiscount(disc);
    setFinalTotal(fin);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerifyUPI = async () => {
    if (!upiId || upiId.trim().length < 3) {
      alert("Enter a valid UPI ID before verifying.");
      return;
    }
    setUpiVerifying(true);
    setUpiVerified(false);
    setTimeout(() => {
      setUpiVerifying(false);
      setUpiVerified(true);
    }, 900);
  };

  const handleCardPay = async () => {
    if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
      alert("Please fill all card details to proceed.");
      return;
    }
    setCardProcessing(true);
    setCardPaid(false);
    setTimeout(() => {
      setCardProcessing(false);
      setCardPaid(true);
    }, 1200);
  };

  const handleConfirmOrder = async () => {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      navigate("/login");
      return;
    }

    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = "Full name is required";
    if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.address?.trim()) newErrors.address = "Address is required";
    if (!form.district?.trim()) newErrors.district = "District is required";
    if (!form.state?.trim()) newErrors.state = "State is required";
    if (!form.pincode?.trim() || !/^\d{5,6}$/.test(form.pincode)) newErrors.pincode = "Pincode must be 5-6 digits";
    if (!form.phone1?.trim() || !/^\d{10}$/.test(form.phone1)) newErrors.phone1 = "Primary phone must be 10 digits";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (paymentMethod === "upi" && !upiVerified) {
      alert("Please verify UPI payment before placing the order.");
      return;
    }
    if (paymentMethod === "card" && !cardPaid) {
      alert("Please complete the card payment before placing the order.");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          deliveryDetails: form,
          paymentMethod,
          items: cartItems,
          subtotalAmount: subtotal,
          discountAmount: discount,
          finalAmount: finalTotal,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      localStorage.removeItem("cartItems");
      setShowSuccess(true);

      const first = (cartItems && cartItems[0]) || null;
      setTimeout(() => {
        if (first) {
          const search = new URLSearchParams({ name: first.name || "", back: "/orders" }).toString();
          navigate(`/review?${search}`);
        } else {
          navigate("/orders");
        }
      }, 1200);
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  const upiUri = `upi://pay?pa=merchantvpa@okbank&pn=Craftsy%20Nest&am=${finalTotal.toFixed(2)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

  return (
    <div className="checkout-container">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="success-circle">
              <svg width="180" height="180" viewBox="0 0 24 24" fill="none">
                <path d="M20 7L9 18l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {!lottieError && (
              <div className="lottie-holder">
                <DotLottieReact
                  src="https://lottie.host/7365d48b-853d-499b-b8cb-05c8ef7d0dbc/g5x30w10BG.lottie"
                  loop={false}
                  autoplay
                  onLoad={() => setLottieLoaded(true)}
                  onError={() => setLottieError(true)}
                />
              </div>
            )}
          </div>
          <div className="success-text">Order placed successfully</div>
        </div>
      )}

      <h1 className="checkout-heading">Checkout</h1>

      <div className="checkout-content">
        {/* Delivery form */}
        {/* ------------------------------
   LEFT: Delivery Details (corrected)
   ------------------------------ */}
        <div className="checkout-form">
          <h2>🏠 Delivery Details</h2>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Street, building, landmark..."
              value={form.address}
              onChange={handleChange}
              autoComplete="street-address"
              required
            />
            {errors.address && <div className="error">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              id="district"
              name="district"
              type="text"
              placeholder="District"
              value={form.district}
              onChange={handleChange}
              required
            />
            {errors.district && <div className="error">{errors.district}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              inputMode="numeric"
              pattern="\d{5,6}"
              maxLength={6}
              placeholder="e.g. 560001"
              value={form.pincode}
              onChange={handleChange}
              required
              aria-describedby="pincodeHelp"
            />
            {errors.pincode && <div className="error">{errors.pincode}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              required
            />
            {errors.state && <div className="error">{errors.state}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone1">Phone Number 1</label>
            <input
              id="phone1"
              name="phone1"
              type="tel"
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={form.phone1}
              onChange={handleChange}
              required
              autoComplete="tel"
            />
            {errors.phone1 && <div className="error">{errors.phone1}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone2">Phone Number 2</label>
            <input
              id="phone2"
              name="phone2"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Alternate phone (optional)"
              value={form.phone2}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>
        </div>


        {/* Payment + Order summary */}
        <div className="checkout-side">
          <div className="payment-section">
            <h2>💳 Payment Method</h2>

            <label><input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} /> Cash on Delivery</label>
            <label><input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={(e) => setPaymentMethod(e.target.value)} /> UPI Payment</label>
            <label><input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} /> Credit/Debit Card</label>

            {paymentMethod === "upi" && (
              <div className="upi-payment">
                <strong>Scan to Pay (UPI)</strong>
                <div className="upi-row">
                  <img src={qrUrl} alt="UPI QR" />
                  <div>
                    <input placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    <button onClick={handleVerifyUPI} disabled={upiVerifying}>
                      {upiVerifying ? "Verifying..." : "Verify & Pay"}
                    </button>
                    {upiVerified && <div className="verified">Payment Verified ✅</div>}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="card-box">
                <input placeholder="Cardholder Name" value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value })} />
                <input placeholder="Card Number" value={cardData.number} onChange={(e) => setCardData({ ...cardData, number: e.target.value })} />
                <div className="card-row">
                  <input placeholder="MM/YY" value={cardData.expiry} onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })} />
                  <input placeholder="CVV" value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })} />
                </div>
                <label><input type="checkbox" checked={cardData.save} onChange={(e) => setCardData({ ...cardData, save: e.target.checked })} /> Save card</label>
                <button onClick={handleCardPay} disabled={cardProcessing}>
                  {cardProcessing ? "Processing…" : `Pay ₹${finalTotal.toFixed(2)}`}
                </button>
                {cardPaid && <div className="verified">✅ Card payment complete</div>}
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <h2>📦 Order Summary</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item._id}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="price-row"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="price-row"><span>Discount:</span><span>-₹{discount.toFixed(2)}</span></div>
            <div className="price-row"><span>Shipping:</span><span>FREE</span></div>
            <div className="price-row total"><span>Total:</span><span>₹{finalTotal.toFixed(2)}</span></div>

            <button onClick={handleConfirmOrder} disabled={cartItems.length === 0}>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

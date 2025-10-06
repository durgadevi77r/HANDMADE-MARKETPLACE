import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import categoryData from "../Data/Categorydata";
import "./Category.css";
import Modal from "../Components/Modal";
import { apiFetch } from "../utils/api";
import StarRating from "../other-components/StarRating";
import TrustIconTopBrand from "../other-components/TrustIconTopBrand";
import TrustIconFastDelivery from "../other-components/TrustIconFastDelivery";
import TrustIconSecure from "../other-components/TrustIconSecure";

const Detail = () => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);

  const navigate = useNavigate();
  const { categorySlug, subcategorySlug, productSlug } = useParams();

  const products = categoryData[categorySlug]?.[subcategorySlug] || [];
  const product = products.find((p) => p.slug === productSlug);

  useEffect(() => {
    if (!product) return;
    const controller = new AbortController();
    const fetchReviews = async () => {
      try {
        const res = await apiFetch(`/api/reviews/product/${encodeURIComponent(product.id || product._id || product.name)}`);
        const data = await res.json();
        if (res.ok) {
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
          setReviewsTotal(data.total || 0);
        }
      } catch (_) { /* ignore */ }
    };
    fetchReviews();
    return () => controller.abort();
  }, [product, productSlug, reviewsPage]);

  useEffect(() => {
    if (!product) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      const local = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlisted(!!local.find((p) => p.slug === product.slug));
      return;
    }
    // lightweight check via profile wishlist
    (async () => {
      try {
        const base = localStorage.getItem('apiBase') || 'http://localhost:5000';
        const res = await fetch(`${base}/api/profile/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
          setWishlisted(!!data.find((p) => p.slug === product.slug));
        }
      } catch (_) { /* ignore */ }
    })();
  }, [product]);

  if (!product) {
    return (
      <div className="detail-container">
        <h2>Product not found</h2>
        <Link
          to={`/category/${categorySlug}/${subcategorySlug}`}
          className="back-btn"
        >
          Go Back
        </Link>
      </div>
    );
  }

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const submitReview = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!reviewRating || !reviewText.trim()) {
      setModalMessage("Please select a rating and write a review.");
      setShowModal(true);
      return;
    }
    try {
      const res = await apiFetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName: product.name,
          rating: reviewRating,
          text: reviewText,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to save review");
      setModalMessage("Thank you! Your review has been submitted.");
      setShowModal(true);
      setReviewRating(0);
      setReviewText("");
      // refresh reviews list
      const listRes = await apiFetch(`/api/reviews/product/${encodeURIComponent(product.id || product._id || product.name)}`);
      const listData = await listRes.json().catch(() => ({}));
      if (listRes.ok) {
        setReviews(Array.isArray(listData.reviews) ? listData.reviews : []);
        setReviewsTotal(listData.total || 0);
      }
    } catch (e) {
      setModalMessage(e.message);
      setShowModal(true);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      const local = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const exists = local.find((p) => p.slug === product.slug);
      let next;
      if (exists) next = local.filter((p) => p.slug !== product.slug);
      else next = [...local, product];
      localStorage.setItem('wishlist', JSON.stringify(next));
      setWishlisted(!exists);
      return;
    }
    try {
      const base = localStorage.getItem('apiBase') || 'http://localhost:5000';
      if (wishlisted) {
        // try to find productId by querying reviews or fallback slug-based remove unsupported -> ignore
        // We'll call remove by scanning wishlist for matching slug first
        const current = await fetch(`${base}/api/profile/wishlist`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []);
        const found = Array.isArray(current) ? current.find((p) => p.slug === product.slug) : null;
        if (found?._id) {
          await fetch(`${base}/api/profile/wishlist/${found._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
          setWishlisted(false);
        }
      } else {
        // Add requires a productId; this project uses static frontend data, so support slug-less add by ignoring if no id
        // If admin seeded products exist, we might discover by slug
        const candidate = await fetch(`${base}/api/products?slug=${encodeURIComponent(product.slug)}`).then(r => r.json()).catch(() => null);
        const productId = candidate?.docs?.[0]?._id || candidate?.[0]?._id;
        if (productId) {
          await fetch(`${base}/api/profile/wishlist`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId }) });
          setWishlisted(true);
        } else {
          // fallback: store locally too for UX
          const local = JSON.parse(localStorage.getItem('wishlist') || '[]');
          if (!local.find((p) => p.slug === product.slug)) {
            local.push(product);
            localStorage.setItem('wishlist', JSON.stringify(local));
          }
          setWishlisted(true);
        }
      }
    } catch (_) { /* ignore */ }
  };

  return (
    <>
      <section className="detail-container">
        <div className="detail-grid">
          {/* Product Image */}
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>

          {/* Product Info */}
          <div className="detail-info">
            <h1>{product.name}</h1>

            <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StarRating rating={product.rating || 4.5} />
              <p className="rating-count">{product.rating || "4.5"}</p>
              <button onClick={() => navigate(`/reviews/${productSlug}`)} title={`Show reviews (${reviewsTotal})`} style={{ marginLeft: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: '#111' }}>
                 Reviews ({reviewsTotal || reviews.length})
              </button>
              <button onClick={toggleWishlist} title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 22, color: wishlisted ? 'red' : '#aaa' }}>❤</span>
              </button>
            </div>

            <div className="price-section">
              {product.offer > 0 ? (
                <>
                  <span className="discounted-price">
                    ₹{Math.round(product.price * (1 - product.offer / 100))}
                  </span>
                  <span className="old-price">₹{product.price}</span>
                  <span className="offer-text">({product.offer}% Off)</span>
                </>
              ) : (
                <span className="discounted-price">₹{product.price}</span>
              )}
            </div>

            {/* Collapsible Sections */}
            <div className="product-extra">
              {/* Famous Place */}
              <button
                className="info-btn"
                onClick={() => toggleSection("famousPlace")}
              >
                {activeSection === "famousPlace" ? "Hide Origin" : "Show Origin"}
              </button>
              {activeSection === "famousPlace" && (
                <div className="info-box section-content">
                  <h3>Famous & Place</h3>
                  <p>{product.famousPlace || "Traditional craft region"}</p>
                </div>
              )}

              {/* About */}
              <button
                className="info-btn"
                onClick={() => toggleSection("about")}
              >
                {activeSection === "about" ? "Hide About" : "Show About"}
              </button>
              {activeSection === "about" && (
                <div className="info-box section-content">
                  <p>{product.about || "No description available."}</p>
                </div>
              )}

              {/* Benefits */}
              <button
                className="info-btn"
                onClick={() => toggleSection("benefits")}
              >
                {activeSection === "benefits" ? "Hide Benefits" : "Show Benefits"}
              </button>
              {activeSection === "benefits" && (
                <div className="info-box section-content">
                  <ul>
                    {product.benefits?.length > 0 ? (
                      product.benefits.map((b, i) => <li key={i}>✔ {b}</li>)
                    ) : (
                      <li>No benefits listed</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Care Instructions */}
              <button
                className="info-btn"
                onClick={() => toggleSection("care")}
              >
                {activeSection === "care"
                  ? "Hide Care Instructions"
                  : "Show Care Instructions"}
              </button>
              {activeSection === "care" && (
                <div className="info-box section-content">
                  <p>{product.care || "Handle with care"}</p>
                </div>
              )}
            </div>


            {/* Feature Icons */}
            <div className="product-features">
              <div className="feature">
                <TrustIconTopBrand />
              </div>
              <div className="feature">
                <TrustIconSecure />
              </div>
              <div className="feature">
                <TrustIconFastDelivery />
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <span>Quantity:</span>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="add-to-cart-section">
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  const userToken = localStorage.getItem("userToken");
                  if (!userToken) {
                    navigate("/login");
                    return;
                  }

                  const cartItem = {
                    ...product,
                    _id: product.id || Math.random().toString(36).substr(2, 9),
                    quantity: quantity,
                  };

                  const existingCartItems =
                    JSON.parse(localStorage.getItem("cartItems")) || [];
                  const existingItemIndex = existingCartItems.findIndex(
                    (item) => item.slug === product.slug
                  );

                  let updatedCart;
                  if (existingItemIndex >= 0) {
                    updatedCart = existingCartItems.map((item, index) =>
                      index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                    );
                  } else {
                    updatedCart = [...existingCartItems, cartItem];
                  }

                  localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                  setModalMessage("Product added to cart!");
                  setShowModal(true);
                }}
              >
                Add to Cart
              </button>
            </div>

            {/* Review Box removed per new flow (handled on Review page) */}

            {/* Reviews removed from bottom - now shown on dedicated Reviews Page */}
          </div>
        </div>
      </section>

      {/* Review Detail Modal removed - now handled on dedicated Reviews Page */}

      {/* Modal */}
      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Detail;

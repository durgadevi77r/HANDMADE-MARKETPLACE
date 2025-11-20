import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Common.css";
import CartIcon from "../other-components/CartIcon";
import Giftbox from "../other-components/Giftbox";
import UserIcon from "../other-components/UserIcon";
import MenuIcon from "../other-components/MenuIcon";
import OfferIcon from "../other-components/OfferIcon";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    const onStorage = () => {
      const ud = localStorage.getItem('userData');
      setUser(ud ? JSON.parse(ud) : null);
    };
    window.addEventListener('storage', onStorage);
    const onAuthChanged = () => onStorage();
    window.addEventListener('auth-changed', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-changed', onAuthChanged);
    };
  }, []);

  return (
    <section id="header">
      {/* Mobile Menu Icon */}
      <div className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </div>

      {/* Sidebar for Mobile */}
      <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          ✕
        </button>
        <ul>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/category" onClick={() => setMenuOpen(false)}>Category</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>
      </div>

      {/* Left Side - Logo & Name */}
      <div className="left">
        <div className="logo">
          <iframe
            className="gift-iframe"
            src="https://lottie.host/embed/7365d48b-853d-499b-b8cb-05c8ef7d0dbc/g5x30w10BG.lottie"
            title="Gift Animation"
          ></iframe>
        </div>
        <div className="web-name">
          <h1>Craftsy Nest</h1>
        </div>
      </div>

      {/* Desktop Navbar */}
      <ul id="navbar">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/category">Category</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {/* <li><Link to="/wishlist" title="Wishlist">Wishlist</Link></li> */}
        <li><Link to="/admin" title="Admin">Admin</Link></li>
      </ul>

      {/* Right Side - Auth / Cart */}
      <div className="right">
        {user ? (
          <div className="user-controls">
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userData");
                setUser(null);
                window.location.reload();
              }}
            >LOGOUT

            </button>
            <button
              aria-label="Account"
              className="icon-btn"
              onClick={() => navigate("/account")}
            >
              <UserIcon />
            </button>


            <div className="cart">
              <Link to="/cart" className="cart-link">
                <CartIcon />
              </Link>
            </div>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/signup" className="auth-link signup-link">Sign Up</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Header;

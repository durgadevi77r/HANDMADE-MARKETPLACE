import { useState } from "react";
import "./Common.css";

function Footer() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault(); // prevent page reload
    setShowPopup(true); // show popup
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>Craftynest</h2>
          <p>Premium handmade products delivered to your doorstep.</p>
        </div>

        <div className="footer-support">
          <h3>Customer Care</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-policies">
          <h3>Policies</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cancellation & Returns</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Info</h3>
          <ul>
            <li>
              <span className="icon email">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                </svg>
              </span>
              <span>info@craftynest.com</span>
            </li>
            <li>
              <span className="icon location">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                </svg>
              </span>
              <span>45 Artisan Street, Handtown</span>
            </li>
            <li>
              <span className="icon phone">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                  <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                </svg>
              </span>
              <span>+91 91234 56789</span>
            </li>
          </ul>
        </div>

        {/* Newsletter / Subscribe */}
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe for offers and new arrivals!</p>
          <form onSubmit={handleSubscribe}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 Craftynest. All rights reserved.</p>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Subscription Successful</h2>
            <p>Thank you for subscribing!</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;

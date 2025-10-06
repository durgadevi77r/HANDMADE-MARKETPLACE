import React, { useState } from 'react';
import './Common.css';
// import ShoppingAnimate from '../other-components/ShoppingAnimate';

const Contact = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    setShowModal(true); // show the modal
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <section id='contact'>
      <h1 className="contact-title">Share Your Spark</h1>
      <div className='contact-container'>
        <div className="form-side">

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Maker’s Name</label>
            <input type="text" id="name" name="name" />

            <label htmlFor="email">Your Craft Mail</label>
            <input type="email" id="email" name="email" />

            <label htmlFor="reason">Pick Your Reason</label>
            <select name="reason" id="reason" defaultValue="">
              <option value="" disabled>Select a Reason</option>
              <option value="inquiry">Inquiry</option>
              <option value="custom">Custom Order</option>
              <option value="feedback">Feedback</option>
            </select>

            <label htmlFor="message">Share your thoughts</label>
            <textarea id="message" name="message" rows="4"></textarea>

            <button type="submit">Send My Note</button>
          </form>
        </div>

        <iframe src="https://lottie.host/embed/3168a14a-f2ba-411d-8990-f7b56fa92486/9iC0lQ7JpQ.lottie"></iframe>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>✨ Thank You!</h2>
            <p>Your note has been submitted successfully.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;

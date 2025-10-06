import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ message, onClose }) => {
  useEffect(() => {
    // Auto-close the modal after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-message">{message}</div>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;
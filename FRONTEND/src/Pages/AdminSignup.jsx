import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import '../Components/Common.css';
import './Auth.css';
import Modal from '../Components/Modal';

const AdminSignup = () => {
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const res = await apiFetch('/api/admin-auth/check');
      const data = await res.json();
      setAdminExists(data.exists);
    } catch (err) {
      console.error('Failed to check admin status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (adminPassword !== confirmPassword) {
      setModalMessage('Passwords do not match');
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/api/admin-auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName, adminEmail, adminPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setModalMessage('Admin created successfully! You can now login.');
        setShowModal(true);
        setTimeout(() => {
          navigate('/admin-login');
        }, 2000);
      } else {
        setModalMessage(data.message || 'Failed to create admin');
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage('Failed to create admin');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (adminExists) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Admin Already Exists</h2>
          <p>An admin account has already been created. Please use the admin login instead.</p>
          <button onClick={() => navigate('/admin-login')} className="auth-button">
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Signup (One-time Setup)</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="adminName">Admin Name</label>
            <input
              type="text"
              id="adminName"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
              placeholder="Enter admin name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="adminEmail">Admin Email</label>
            <input
              type="email"
              id="adminEmail"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
              placeholder="Enter admin email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Enter password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Confirm password"
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p><button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Back to User Login</button></p>
        </div>
      </div>
      
      {showModal && (
        <Modal 
          message={modalMessage} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default AdminSignup;

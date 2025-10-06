import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import '../Components/Common.css';
import './Auth.css';
import Modal from '../Components/Modal';

const AdminLogin = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail, adminPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify({
          id: data._id,
          name: data.adminName,
          email: data.adminEmail,
          role: 'admin',
          isAdmin: true
        }));
        window.dispatchEvent(new Event('auth-changed'));
        setModalMessage('Admin login successful! Redirecting to dashboard...');
        setShowModal(true);
        setTimeout(() => {
          navigate('/admin/reports');
        }, 1000);
      } else {
        setModalMessage(data.message || 'Invalid admin credentials');
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage('Failed to login');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter admin password"
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Admin'}
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

export default AdminLogin;
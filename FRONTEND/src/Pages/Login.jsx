import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Components/Common.css';
import './Auth.css';
import Modal from '../Components/Modal';
import { apiFetch, resolveApiBase } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TEMP: constant credentials support
      const payload = { email: email || 'admin@example.com', password: password || 'admin123' };
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user info to localStorage
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }));
      window.dispatchEvent(new Event('auth-changed'));

      // Show success message
      setModalMessage('Login successful! Redirecting to home page...');
      setShowModal(true);
      
      // Redirect to home page after a short delay
      setTimeout(async () => {
        await resolveApiBase();
        navigate(data.role === 'admin' || data.isAdmin ? '/admin/reports' : '/');
      }, 600);
    } catch (err) {
      setError(err.message);
      setModalMessage(err.message);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div id="googleSignIn" style={{ marginTop: 12, textAlign: 'center' }} />
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          <p><Link to="/forgot-password" style={{ color: '#666', fontSize: '14px',marginTop:"20px" }}>Forgot Password?</Link></p>
          <p><button onClick={() => navigate('/admin-login')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px', marginTop:"10px" }}>Admin Login</button></p>
        </div>
      </div>
      
      {/* Message Modal */}
      {showModal && (
        <Modal 
          message={modalMessage} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default Login;
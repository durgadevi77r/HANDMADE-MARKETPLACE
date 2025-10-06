import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Components/Common.css';
import './Auth.css';
import Modal from '../Components/Modal';
import { apiFetch, resolveApiBase } from '../utils/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setModalMessage('Passwords do not match');
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
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
      setModalMessage('Account created successfully! Redirecting to home page...');
      setShowModal(true);
      
      // Redirect to home page after a short delay
      setTimeout(async () => {
        await resolveApiBase();
        navigate('/');
      }, 800);
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
        <h2>Create an Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
              minLength="6"
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
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button
            type="button"
            className="auth-button"
            onClick={async () => {
              try {
                const idToken = window.prompt('Paste Google ID token (for now)') || '';
                if (!idToken) return;
                const res = await apiFetch('/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Google auth failed');
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify({ id: data._id, name: data.name, email: data.email, role: data.role }));
                setModalMessage('Account created successfully! Redirecting to home page...');
                setShowModal(true);
                setTimeout(async () => { await resolveApiBase(); navigate('/'); window.location.reload(); }, 1200);
              } catch (e) {
                setModalMessage(e.message);
                setShowModal(true);
              }
            }}
            style={{ background: '#fff', color: '#111', border: '1px solid #ddd' }}
          >
            Continue with Google
          </button>
        </div>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
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

export default Signup;
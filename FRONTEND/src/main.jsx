import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Google Identity Services
window.initGoogleOneTap = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  if (!clientId || !window.google || !document.getElementById('googleSignIn')) return;
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: async (response) => {
      try {
        const res = await fetch(`${localStorage.getItem('apiBase') || 'http://localhost:5000'}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: response.credential }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Google auth failed');
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify({ id: data._id, name: data.name, email: data.email, role: data.role }));
        window.location.assign('/');
      } catch (e) {
        console.error('Google sign-in error', e);
      }
    },
  });
  window.google.accounts.id.renderButton(document.getElementById('googleSignIn'), { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with' });
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import './Auth.css';

export default function Login() {
  const { setUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    try {
      const user = loginUser(form.email, form.password);
      setUser(user);
      success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (e) {
      setErr(e.message);
      error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@estatevault.com', password: 'admin123' });
    else setForm({ email: 'sarah@example.com', password: 'password123' });
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">⬡ Estate<em>Vault</em></Link>
            <h1>Welcome back</h1>
            <p>Sign in to your account</p>
          </div>

          <div className="demo-btns">
            <span className="demo-label">Quick fill:</span>
            <button className="btn btn-outline btn-sm" onClick={() => fillDemo('customer')}>Customer</button>
            <button className="btn btn-outline btn-sm" onClick={() => fillDemo('admin')}>Admin</button>
          </div>

          {err && <div className="auth-error">{err}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" placeholder="••••••••"
                value={form.password} onChange={handle} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

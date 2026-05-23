// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import './Auth.css';

export default function Register() {
  const { setUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) { setErr('Passwords do not match.'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    try {
      registerUser({ name: form.name, email: form.email, password: form.password });
      const user = loginUser(form.email, form.password);
      setUser(user);
      success(`Welcome to EstateVault, ${user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (e) {
      setErr(e.message);
      error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">⬡ Estate<em>Vault</em></Link>
            <h1>Create account</h1>
            <p>Join thousands of property seekers</p>
          </div>

          {err && <div className="auth-error">{err}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" type="text" className="form-input" placeholder="John Smith"
                value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input name="confirm" type="password" className="form-input" placeholder="Repeat password"
                value={form.confirm} onChange={handle} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

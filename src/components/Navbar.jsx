// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    success('Logged out successfully.');
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'navbar-solid' : 'navbar-transparent'} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">Estate<em>Vault</em></span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Listings</Link>

          {user?.role === 'customer' && (
            <>
              <Link to="/my-properties" className={`nav-link ${location.pathname === '/my-properties' ? 'active' : ''}`}>My Properties</Link>
              <Link to="/wishlist" className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}>Wishlist</Link>
              <Link to="/add-property" className="btn btn-gold btn-sm">+ List Property</Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/admin/customers" className="nav-link">Customers</Link>
              <Link to="/admin/properties" className="nav-link">Properties</Link>
              <Link to="/admin/pending" className="nav-link">Pending</Link>
            </>
          )}
        </div>

        {/* Auth */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.name[0].toUpperCase()}</div>
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link">Listings</Link>
          {user?.role === 'customer' && (
            <>
              <Link to="/my-properties" className="mobile-link">My Properties</Link>
              <Link to="/wishlist" className="mobile-link">Wishlist</Link>
              <Link to="/add-property" className="mobile-link">+ List Property</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="mobile-link">Dashboard</Link>
              <Link to="/admin/customers" className="mobile-link">Customers</Link>
              <Link to="/admin/properties" className="mobile-link">Properties</Link>
              <Link to="/admin/pending" className="mobile-link">Pending</Link>
            </>
          )}
          {user ? (
            <button className="mobile-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="mobile-link">Login</Link>
              <Link to="/register" className="mobile-link">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

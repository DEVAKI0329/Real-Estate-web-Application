// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span style={{ color: 'var(--gold)' }}>⬡</span>
            <span>Estate<em>Vault</em></span>
          </div>
          <p>Your trusted platform for discovering premium properties across India.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/">All Listings</Link>
            <Link to="/register">Join Us</Link>
            <Link to="/add-property">List Property</Link>
          </div>
          <div className="footer-col">
            <h4>Property Types</h4>
            <span>Apartments</span>
            <span>Villas</span>
            <span>Commercial</span>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <span>hello@estatevault.in</span>
            <span>+91 98765 43210</span>
            <span>Mumbai, Maharashtra</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} EstateVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// src/pages/PropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, addToWishlist, removeFromWishlist, isInWishlist, formatPrice, formatDate } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import './PropertyDetails.css';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, info } = useToast();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const p = getPropertyById(id);
      setProperty(p);
      if (user?.role === 'customer' && p) {
        setWishlisted(isInWishlist(user.id, p.id));
      }
      setLoading(false);
    }, 300);
  }, [id, user]);

  const handleWishlist = () => {
    if (!user) { info('Please login to save properties.'); return; }
    if (user.role === 'admin') return;
    if (wishlisted) {
      removeFromWishlist(user.id, property.id);
      setWishlisted(false);
      success('Removed from wishlist.');
    } else {
      addToWishlist(user.id, property.id);
      setWishlisted(true);
      success('Added to wishlist!');
    }
  };

  if (loading) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  if (!property) return (
    <div className="page-wrapper">
      <div className="container empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>Property Not Found</h3>
        <p>This listing may have been removed.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Listings</Link>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="detail-breadcrumb">
          <Link to="/">Listings</Link> › <span>{property.title}</span>
        </div>

        <div className="detail-layout">
          {/* Left */}
          <div className="detail-main">
            <div className="detail-image-wrapper">
              <img src={property.image} alt={property.title}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'; }} />
              <div className={`detail-status badge badge-${property.status}`}>{property.status}</div>
            </div>

            <div className="detail-body">
              <div className="detail-type-row">
                <span className="detail-type badge badge-gold">{property.type}</span>
                <span className="detail-date">Listed {formatDate(property.createdAt)}</span>
              </div>
              <h1 className="detail-title">{property.title}</h1>
              <div className="detail-location">⊕ {property.location}</div>

              <div className="detail-specs">
                {property.bedrooms > 0 && (
                  <div className="spec-item">
                    <span className="spec-icon">🛏</span>
                    <div><strong>{property.bedrooms}</strong><span>Bedrooms</span></div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="spec-item">
                    <span className="spec-icon">🚿</span>
                    <div><strong>{property.bathrooms}</strong><span>Bathrooms</span></div>
                  </div>
                )}
                {property.area && (
                  <div className="spec-item">
                    <span className="spec-icon">📐</span>
                    <div><strong>{property.area.toLocaleString()}</strong><span>sqft</span></div>
                  </div>
                )}
              </div>

              <div className="detail-divider" />
              <h3 className="detail-section-title">About This Property</h3>
              <p className="detail-description">{property.description}</p>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="detail-sidebar">
            <div className="price-card card">
              <div className="detail-price">{formatPrice(property.price)}</div>
              {property.area && (
                <div className="price-per-sqft">
                  {formatPrice(Math.round(property.price / property.area))} / sqft
                </div>
              )}

              {user?.role === 'customer' && (
                <button
                  className={`btn ${wishlisted ? 'btn-danger' : 'btn-outline'} btn-lg wishlist-action`}
                  onClick={handleWishlist}
                >
                  {wishlisted ? '♥ Saved' : '♡ Save Property'}
                </button>
              )}

              <Link to="/" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
                ← Back to Listings
              </Link>
            </div>

            <div className="owner-card card">
              <h4>Listed By</h4>
              <div className="owner-info">
                <div className="owner-avatar">{property.ownerName[0]}</div>
                <div>
                  <div className="owner-name">{property.ownerName}</div>
                  <div className="owner-contact">{property.ownerContact}</div>
                </div>
              </div>
            </div>

            {user?.role === 'customer' && user.id === property.userId && (
              <div className="owner-actions card">
                <h4>Manage Listing</h4>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit-property/${property.id}`)}>Edit</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

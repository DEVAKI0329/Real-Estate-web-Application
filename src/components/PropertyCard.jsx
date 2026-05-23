// src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/storage';
import './PropertyCard.css';

export default function PropertyCard({
  property,
  showStatus = false,
  isWishlisted,
  onWishlist,
  onDelete,
  onEdit,
  actionButtons,
}) {
  const { id, title, price, location, type, image, status, bedrooms, area, ownerName } = property;

  return (
    <div className="property-card card">
      <Link to={`/property/${id}`} className="card-image-wrapper">
        <img
          src={image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'}
          alt={title}
          className="card-image"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'; }}
        />
        <div className="card-type-badge">{type}</div>
        {showStatus && (
          <div className={`card-status-badge badge badge-${status}`}>{status}</div>
        )}
      </Link>

      <div className="card-body">
        <div className="card-header">
          <div className="card-price">{formatPrice(price)}</div>
          {onWishlist && (
            <button
              className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
              onClick={e => { e.preventDefault(); onWishlist(id); }}
              aria-label="Wishlist"
            >
              {isWishlisted ? '♥' : '♡'}
            </button>
          )}
        </div>

        <Link to={`/property/${id}`}>
          <h3 className="card-title">{title}</h3>
        </Link>

        <div className="card-location">
          <span className="location-dot">⊕</span>
          {location}
        </div>

        <div className="card-meta">
          {bedrooms > 0 && <span>{bedrooms} Beds</span>}
          {area && <span>{area.toLocaleString()} sqft</span>}
          {ownerName && <span>{ownerName}</span>}
        </div>

        {(onEdit || onDelete || actionButtons) && (
          <div className="card-actions">
            {actionButtons}
            {onEdit && (
              <button className="btn btn-outline btn-sm" onClick={() => onEdit(id)}>Edit</button>
            )}
            {onDelete && (
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(id)}>Delete</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

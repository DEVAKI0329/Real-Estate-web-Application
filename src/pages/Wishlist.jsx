// src/pages/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { getUserWishlist, removeFromWishlist } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import PropertyCard from '../components/PropertyCard';

export default function Wishlist() {
  const { user } = useAuth();
  const { success } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const wl = getUserWishlist(user.id);
    setItems(wl);
    setLoading(false);
  };

  useEffect(() => { setTimeout(load, 300); }, []);

  const handleRemove = (propertyId) => {
    removeFromWishlist(user.id, propertyId);
    setItems(prev => prev.filter(i => i.propertyId !== propertyId));
    success('Removed from wishlist.');
  };

  if (loading) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>My Wishlist</h1>
          <p>{items.length} saved {items.length === 1 ? 'property' : 'properties'}</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">♡</div>
            <h3>Your wishlist is empty</h3>
            <p>Browse listings and save properties you love to view them here.</p>
          </div>
        ) : (
          <div className="property-grid">
            {items.map(item => (
              <PropertyCard
                key={item.id}
                property={item.property}
                isWishlisted={true}
                onWishlist={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

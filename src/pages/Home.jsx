// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties, getUserWishlist, addToWishlist, removeFromWishlist, isInWishlist } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const DEFAULT_FILTERS = { type: '', priceRange: null, sortBy: '' };

export default function Home() {
  const { user } = useAuth();
  const { success, info } = useToast();
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [wishlisted, setWishlisted] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const all = getProperties().filter(p => p.status === 'approved');
      setProperties(all);
      setFiltered(all);
      if (user?.role === 'customer') {
        const wl = getUserWishlist(user.id);
        setWishlisted(new Set(wl.map(w => w.propertyId)));
      }
      setLoading(false);
    }, 400);
  }, [user]);

  useEffect(() => {
    let result = [...properties];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    }
    if (filters.type) result = result.filter(p => p.type === filters.type);
    if (filters.priceRange) {
      result = result.filter(p => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max);
    }
    if (filters.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFiltered(result);
  }, [properties, query, filters]);

  const handleWishlist = (propertyId) => {
    if (!user) { info('Please login to save properties.'); return; }
    if (user.role === 'admin') { info('Admins cannot add to wishlist.'); return; }
    if (isInWishlist(user.id, propertyId)) {
      removeFromWishlist(user.id, propertyId);
      setWishlisted(s => { const n = new Set(s); n.delete(propertyId); return n; });
      success('Removed from wishlist.');
    } else {
      addToWishlist(user.id, propertyId);
      setWishlisted(s => new Set([...s, propertyId]));
      success('Added to wishlist!');
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="hero-eyebrow">Premium Real Estate</p>
          <h1 className="hero-title">Find Your<br /><em>Dream Home</em></h1>
          <p className="hero-sub">Discover curated properties across India's finest locations.</p>
          <div className="hero-search">
            <SearchBar onSearch={setQuery} />
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>{properties.length}+</strong><span>Listings</span></div>
            <div className="hero-divider" />
            <div className="hero-stat"><strong>12+</strong><span>Cities</span></div>
            <div className="hero-divider" />
            <div className="hero-stat"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <div className="container listings-layout">
        <aside>
          <Filter filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </aside>

        <main>
          <div className="listings-toolbar">
            <p className="results-count">
              {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
              {query && <span className="query-tag">"{query}" <button onClick={() => setQuery('')}>✕</button></span>}
            </p>
            {user?.role === 'customer' && (
              <Link to="/add-property" className="btn btn-gold btn-sm">+ List Property</Link>
            )}
          </div>

          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏡</div>
              <h3>No properties found</h3>
              <p>Try adjusting your search or filters to discover more listings.</p>
            </div>
          ) : (
            <div className="property-grid">
              {filtered.map(p => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isWishlisted={wishlisted.has(p.id)}
                  onWishlist={handleWishlist}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

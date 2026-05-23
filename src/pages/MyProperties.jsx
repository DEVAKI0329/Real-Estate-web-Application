// src/pages/MyProperties.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties, deleteProperty, formatPrice } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import PropertyCard from '../components/PropertyCard';
import './MyProperties.css';

export default function MyProperties() {
  const { user } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const mine = getProperties().filter(p => p.userId === user.id);
    setProperties(mine);
    setLoading(false);
  };

  useEffect(() => { setTimeout(load, 300); }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return;
    deleteProperty(id);
    setProperties(prev => prev.filter(p => p.id !== id));
    success('Property deleted.');
  };

  const stats = {
    total: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
  };

  if (loading) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1>My Properties</h1>
            <p>Manage your listed properties</p>
          </div>
          <button className="btn btn-gold" onClick={() => navigate('/add-property')}>+ Add Property</button>
        </div>

        {/* Stats */}
        <div className="my-stats">
          {[
            { label: 'Total', value: stats.total, color: 'var(--charcoal)' },
            { label: 'Approved', value: stats.approved, color: 'var(--sage)' },
            { label: 'Pending', value: stats.pending, color: '#D97706' },
            { label: 'Rejected', value: stats.rejected, color: 'var(--rust)' },
          ].map(s => (
            <div key={s.label} className="my-stat card">
              <div className="my-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="my-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <h3>No properties yet</h3>
            <p>Start by listing your first property. It will go live after admin approval.</p>
            <button className="btn btn-gold" style={{ marginTop: 20 }} onClick={() => navigate('/add-property')}>
              List Your First Property
            </button>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                showStatus
                onEdit={(id) => navigate(`/edit-property/${id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

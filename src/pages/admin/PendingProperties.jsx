// src/pages/admin/PendingProperties.jsx
import React, { useState, useEffect } from 'react';
import { getProperties, approveProperty, rejectProperty, formatPrice, formatDate } from '../../utils/storage';
import { useToast } from '../../utils/ToastContext';
import './Admin.css';
import './PendingProperties.css';

export default function PendingProperties() {
  const { success } = useToast();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const props = getProperties()
      .filter(p => p.status === 'pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPending(props);
    setLoading(false);
  };

  useEffect(() => { setTimeout(load, 300); }, []);

  const handleApprove = (id) => {
    approveProperty(id);
    setPending(prev => prev.filter(p => p.id !== id));
    success('Property approved and published!');
  };

  const handleReject = (id) => {
    rejectProperty(id);
    setPending(prev => prev.filter(p => p.id !== id));
    success('Property rejected.');
  };

  if (loading) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>Pending Review</h1>
          <p>{pending.length} {pending.length === 1 ? 'property' : 'properties'} awaiting approval</p>
        </div>

        {pending.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <h3>All caught up!</h3>
            <p>No properties are waiting for review right now.</p>
          </div>
        ) : (
          <div className="pending-list">
            {pending.map(p => (
              <div key={p.id} className="pending-card card">
                <div className="pending-image">
                  <img
                    src={p.image}
                    alt={p.title}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'; }}
                  />
                </div>

                <div className="pending-body">
                  <div className="pending-meta">
                    <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{p.type}</span>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>Submitted {formatDate(p.createdAt)}</span>
                  </div>
                  <h3 className="pending-title">{p.title}</h3>
                  <div className="pending-location">⊕ {p.location}</div>
                  <p className="pending-description">{p.description}</p>

                  <div className="pending-specs">
                    {p.bedrooms > 0 && <span>🛏 {p.bedrooms} Beds</span>}
                    {p.bathrooms > 0 && <span>🚿 {p.bathrooms} Baths</span>}
                    {p.area > 0 && <span>📐 {p.area.toLocaleString()} sqft</span>}
                  </div>
                </div>

                <div className="pending-sidebar">
                  <div className="pending-price">{formatPrice(p.price)}</div>

                  <div className="pending-owner">
                    <div className="mini-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{p.ownerName[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.ownerName}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.ownerContact}</div>
                    </div>
                  </div>

                  <div className="pending-actions">
                    <button
                      className="btn btn-lg"
                      style={{ background: '#D1FAE5', color: '#065F46', width: '100%', justifyContent: 'center' }}
                      onClick={() => handleApprove(p.id)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="btn btn-lg"
                      style={{ background: '#FEE2E2', color: '#991B1B', width: '100%', justifyContent: 'center' }}
                      onClick={() => handleReject(p.id)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

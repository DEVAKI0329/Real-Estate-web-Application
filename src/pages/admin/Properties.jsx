// src/pages/admin/Properties.jsx
import React, { useState, useEffect } from 'react';
import { getProperties, deleteProperty, approveProperty, rejectProperty, formatPrice, formatDate } from '../../utils/storage';
import { useToast } from '../../utils/ToastContext';
import './Admin.css';

export default function Properties() {
  const { success } = useToast();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setProperties(getProperties().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setLoading(false);
  };

  useEffect(() => { setTimeout(load, 300); }, []);

  const handleApprove = (id) => {
    approveProperty(id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    success('Property approved.');
  };

  const handleReject = (id) => {
    rejectProperty(id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    success('Property rejected.');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this property permanently?')) return;
    deleteProperty(id);
    setProperties(prev => prev.filter(p => p.id !== id));
    success('Property deleted.');
  };

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()) || p.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>All Properties</h1>
          <p>{properties.length} total listings on the platform</p>
        </div>

        <div className="admin-toolbar">
          <div className="admin-toolbar-left">
            <div className="admin-search">
              <span>⌕</span>
              <input placeholder="Search title, location, owner…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-input" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>{filtered.length} results</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No properties found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.image} alt="" style={{ width: 42, height: 32, objectFit: 'cover', borderRadius: 4 }}
                        onError={e => { e.target.style.display = 'none'; }} />
                      <span style={{ fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{p.ownerName}</td>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{formatPrice(p.price)}</td>
                  <td><span style={{ textTransform: 'capitalize', fontSize: 13 }}>{p.type}</span></td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{formatDate(p.createdAt)}</td>
                  <td>
                    <div className="action-group">
                      {p.status !== 'approved' && (
                        <button className="btn btn-sm" style={{ background: '#D1FAE5', color: '#065F46' }} onClick={() => handleApprove(p.id)}>Approve</button>
                      )}
                      {p.status !== 'rejected' && (
                        <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#991B1B' }} onClick={() => handleReject(p.id)}>Reject</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

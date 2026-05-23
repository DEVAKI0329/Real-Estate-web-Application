// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, getProperties, formatPrice } from '../../utils/storage';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const users = getUsers().filter(u => u.role === 'customer');
      const props = getProperties();
      setStats({
        customers: users.length,
        totalProps: props.length,
        approved: props.filter(p => p.status === 'approved').length,
        pending: props.filter(p => p.status === 'pending').length,
        rejected: props.filter(p => p.status === 'rejected').length,
        totalValue: props.filter(p => p.status === 'approved').reduce((s, p) => s + p.price, 0),
        recentProps: props.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
        recentUsers: users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
      });
      setLoading(false);
    }, 400);
  }, []);

  if (loading) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  const statCards = [
    { label: 'Total Customers', value: stats.customers, icon: '👥', color: '#3B82F6', link: '/admin/customers' },
    { label: 'Total Properties', value: stats.totalProps, icon: '🏠', color: '#8B5CF6', link: '/admin/properties' },
    { label: 'Approved', value: stats.approved, icon: '✅', color: '#10B981', link: '/admin/properties' },
    { label: 'Pending Review', value: stats.pending, icon: '⏳', color: '#F59E0B', link: '/admin/pending' },
    { label: 'Rejected', value: stats.rejected, icon: '❌', color: '#EF4444', link: '/admin/properties' },
    { label: 'Portfolio Value', value: formatPrice(stats.totalValue), icon: '💰', color: '#C9A84C', link: '/admin/properties' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of the EstateVault platform</p>
        </div>

        <div className="admin-stats-grid">
          {statCards.map(s => (
            <Link to={s.link} key={s.label} className="admin-stat-card card">
              <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </Link>
          ))}
        </div>

        <div className="admin-tables-row">
          {/* Recent Properties */}
          <div className="admin-table-section card">
            <div className="section-header">
              <h3>Recent Properties</h3>
              <Link to="/admin/properties" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Title</th><th>Owner</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {stats.recentProps.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.title}</td>
                      <td style={{ color: 'var(--muted)' }}>{p.ownerName}</td>
                      <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Customers */}
          <div className="admin-table-section card">
            <div className="section-header">
              <h3>Recent Customers</h3>
              <Link to="/admin/customers" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th></tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="mini-avatar">{u.name[0]}</div>
                          <span style={{ fontWeight: 500 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 13 }}>{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

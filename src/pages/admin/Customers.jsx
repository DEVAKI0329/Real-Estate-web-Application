// src/pages/admin/Customers.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, getProperties, formatDate } from '../../utils/storage';
import { useToast } from '../../utils/ToastContext';
import './Admin.css';

export default function Customers() {
  const { success } = useToast();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    const users = getUsers().filter(u => u.role === 'customer');
    const props = getProperties();
    const enriched = users.map(u => ({
      ...u,
      propertyCount: props.filter(p => p.userId === u.id).length,
    }));
    setCustomers(enriched);
    setLoading(false);
  };

  useEffect(() => { setTimeout(load, 300); }, []);

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete customer "${name}"? This will also remove their properties.`)) return;
    deleteUser(id);
    setCustomers(prev => prev.filter(u => u.id !== id));
    success('Customer deleted.');
  };

  const filtered = customers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>Customers</h1>
          <p>{customers.length} registered customers</p>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <span>⌕</span>
            <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Properties</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No customers found</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="mini-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{u.name[0]}</div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                  <td>
                    <span className="badge badge-gold">{u.propertyCount} listing{u.propertyCount !== 1 ? 's' : ''}</span>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id, u.name)}>Delete</button>
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

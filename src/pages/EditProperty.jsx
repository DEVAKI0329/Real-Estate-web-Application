// src/pages/EditProperty.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, updateProperty } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { PROPERTY_TYPES } from '../data/mockData';
import './PropertyForm.css';

export default function EditProperty() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const p = getPropertyById(id);
    if (!p || p.userId !== user?.id) {
      error('Property not found or unauthorized.');
      navigate('/my-properties');
      return;
    }
    setForm({
      title: p.title, description: p.description || '', price: p.price,
      location: p.location, type: p.type, image: p.image || '',
      ownerContact: p.ownerContact || '', bedrooms: p.bedrooms || '',
      bathrooms: p.bathrooms || '', area: p.area || '',
    });
  }, [id, user]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      error('Please fill all required fields.'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    try {
      updateProperty(id, {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        status: 'pending',
      });
      success('Property updated! Re-submitted for review.');
      navigate('/my-properties');
    } catch (e) {
      error('Update failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="loading-container page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container form-page">
        <div className="page-header">
          <h1>Edit Property</h1>
          <p>Update your listing details. Changes require re-approval.</p>
        </div>

        <div className="form-layout">
          <form className="property-form card" onSubmit={submit}>
            <div className="form-section-title">Basic Information</div>

            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input name="title" className="form-input" value={form.title} onChange={handle} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input name="price" type="number" className="form-input" value={form.price} onChange={handle} required min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select name="type" className="form-input" value={form.type} onChange={handle}>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input name="location" className="form-input" value={form.location} onChange={handle} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-input" value={form.description} onChange={handle} rows={4} />
            </div>

            <div className="form-section-title" style={{ marginTop: 8 }}>Property Details</div>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input name="bedrooms" type="number" className="form-input" value={form.bedrooms} onChange={handle} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input name="bathrooms" type="number" className="form-input" value={form.bathrooms} onChange={handle} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Area (sqft)</label>
                <input name="area" type="number" className="form-input" value={form.area} onChange={handle} min="0" />
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: 8 }}>Contact & Media</div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input name="ownerContact" className="form-input" value={form.ownerContact} onChange={handle} />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input name="image" className="form-input" value={form.image} onChange={handle} />
            </div>

            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Preview" onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

          <aside className="form-sidebar">
            <div className="info-card card">
              <div className="info-icon">⚠️</div>
              <h4>Note</h4>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
                Editing your property will set it back to <strong>pending</strong> status.
                An admin will review and re-approve your listing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

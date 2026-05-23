// src/pages/AddProperty.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import { PROPERTY_TYPES, MOCK_IMAGES } from '../data/mockData';
import './PropertyForm.css';

export default function AddProperty() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '',
    type: 'apartment', image: '', ownerName: user?.name || '',
    ownerContact: '', bedrooms: '', bathrooms: '', area: '',
  });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      error('Please fill in all required fields.'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      addProperty({
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        image: form.image || MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
        userId: user.id,
        ownerName: user.name,
      });
      success('Property submitted for review!');
      navigate('/my-properties');
    } catch (e) {
      error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container form-page">
        <div className="page-header">
          <h1>List a Property</h1>
          <p>Fill in the details. Your listing will appear after admin approval.</p>
        </div>

        <div className="form-layout">
          <form className="property-form card" onSubmit={submit}>
            <div className="form-section-title">Basic Information</div>

            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input name="title" className="form-input" placeholder="e.g. Modern 3BHK Flat in Bandra"
                value={form.title} onChange={handle} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input name="price" type="number" className="form-input" placeholder="e.g. 5000000"
                  value={form.price} onChange={handle} required min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Property Type *</label>
                <select name="type" className="form-input" value={form.type} onChange={handle}>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input name="location" className="form-input" placeholder="e.g. Bandra West, Mumbai"
                value={form.location} onChange={handle} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-input" placeholder="Describe the property, features, amenities…"
                value={form.description} onChange={handle} rows={4} />
            </div>

            <div className="form-section-title" style={{ marginTop: 8 }}>Property Details</div>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input name="bedrooms" type="number" className="form-input" placeholder="0"
                  value={form.bedrooms} onChange={handle} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input name="bathrooms" type="number" className="form-input" placeholder="0"
                  value={form.bathrooms} onChange={handle} min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Area (sqft)</label>
                <input name="area" type="number" className="form-input" placeholder="0"
                  value={form.area} onChange={handle} min="0" />
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: 8 }}>Contact & Media</div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input name="ownerContact" className="form-input" placeholder="+91 XXXXX XXXXX"
                value={form.ownerContact} onChange={handle} />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL (optional)</label>
              <input name="image" className="form-input" placeholder="https://… (leave blank for auto)"
                value={form.image} onChange={handle} />
            </div>

            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Preview"
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Listing'}
              </button>
            </div>
          </form>

          <aside className="form-sidebar">
            <div className="info-card card">
              <div className="info-icon">📋</div>
              <h4>How it works</h4>
              <ol className="info-steps">
                <li>Fill in your property details</li>
                <li>Submit for admin review</li>
                <li>Get approved within 24 hours</li>
                <li>Your listing goes live!</li>
              </ol>
            </div>
            <div className="info-card card">
              <div className="info-icon">💡</div>
              <h4>Tips for better listings</h4>
              <ul className="info-tips">
                <li>Use a clear, descriptive title</li>
                <li>Add high-quality images</li>
                <li>Be specific about location</li>
                <li>Mention all amenities</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// src/components/Filter.jsx
import React from 'react';
import { PROPERTY_TYPES, PRICE_RANGES } from '../data/mockData';
import './Filter.css';

export default function Filter({ filters, onChange, onReset }) {
  const handle = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <aside className="filter-panel card">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="btn btn-ghost btn-sm" onClick={onReset}>Reset</button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Property Type</label>
        <div className="filter-chips">
          <button
            className={`chip ${!filters.type ? 'chip-active' : ''}`}
            onClick={() => handle('type', '')}
          >All</button>
          {PROPERTY_TYPES.map(t => (
            <button
              key={t}
              className={`chip ${filters.type === t ? 'chip-active' : ''}`}
              onClick={() => handle('type', t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        <div className="filter-price-list">
          <label className="price-option">
            <input
              type="radio" name="price"
              checked={!filters.priceRange}
              onChange={() => handle('priceRange', null)}
            />
            <span>Any Price</span>
          </label>
          {PRICE_RANGES.map((r, i) => (
            <label key={i} className="price-option">
              <input
                type="radio" name="price"
                checked={filters.priceRange?.label === r.label}
                onChange={() => handle('priceRange', r)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      <div className="filter-section">
        <label className="filter-label">Sort By</label>
        <select
          className="form-input"
          value={filters.sortBy || ''}
          onChange={e => handle('sortBy', e.target.value)}
        >
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
}

// src/components/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">⌕</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by city, locality, or landmark…"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {value && (
        <button type="button" className="search-clear" onClick={handleClear}>✕</button>
      )}
      <button type="submit" className="btn btn-gold search-btn">Search</button>
    </form>
  );
}

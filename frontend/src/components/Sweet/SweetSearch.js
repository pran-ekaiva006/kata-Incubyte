import React, { useState } from 'react';
import './Sweet.css';

const SweetSearch = ({ onSearch, onReset }) => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const categories = ['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Other'];

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchParams.name) params.name = searchParams.name;
    if (searchParams.category) params.category = searchParams.category;
    if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
    if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;
    onSearch(params);
  };

  const handleReset = () => {
    setSearchParams({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
    onReset();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-row">
          <input
            type="text"
            name="name"
            placeholder="Search by name..."
            value={searchParams.name}
            onChange={handleChange}
            className="search-input"
          />
          
          <select
            name="category"
            value={searchParams.category}
            onChange={handleChange}
            className="search-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="search-row">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={searchParams.minPrice}
            onChange={handleChange}
            className="search-input-small"
            step="0.01"
            min="0"
          />
          
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={searchParams.maxPrice}
            onChange={handleChange}
            className="search-input-small"
            step="0.01"
            min="0"
          />

          <button type="submit" className="btn-search">
            Search
          </button>
          
          <button type="button" onClick={handleReset} className="btn-reset">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SweetSearch;

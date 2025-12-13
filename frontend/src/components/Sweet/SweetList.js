import React, { useState, useEffect } from 'react';
import sweetService from '../../services/sweetService';
import SweetCard from './SweetCard';
import SweetSearch from './SweetSearch';
import SweetForm from './SweetForm';
import { useAuth } from '../../context/AuthContext';
import './Sweet.css';

const SweetList = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getAllSweets();
      setSweets(data.sweets);
      setError('');
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params) => {
    try {
      setLoading(true);
      const data = await sweetService.searchSweets(params);
      setSweets(data.sweets);
      setError('');
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchSweets();
  };

  const handleAddSweet = () => {
    setEditingSweet(null);
    setShowForm(true);
  };

  const handleEditSweet = (sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSweet(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSweet(null);
    fetchSweets();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await sweetService.deleteSweet(id);
        fetchSweets();
      } catch (err) {
        alert('Failed to delete sweet');
      }
    }
  };

  const handlePurchase = async (id, quantity) => {
    try {
      await sweetService.purchaseSweet(id, quantity);
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      await sweetService.restockSweet(id, quantity);
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    }
  };

  return (
    <div className="sweet-list-container">
      <div className="sweet-list-header">
        <h1>🍬 Sweet Shop</h1>
        {isAdmin() && (
          <button className="btn-add" onClick={handleAddSweet}>
            + Add New Sweet
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <SweetSearch onSearch={handleSearch} onReset={handleReset} />

      {loading && (
        <div className="loading">
          <span className="spinner" /> Loading sweets...
        </div>
      )}

      {!loading && (
        <div className="results-count">
          Showing {sweets.length} result{sweets.length !== 1 ? 's' : ''}
        </div>
      )}

      {sweets.length === 0 && !loading ? (
        <div className="no-sweets">
          <p>No sweets found. {isAdmin() && 'Add some sweets to get started!'}</p>
        </div>
      ) : (
        <div className="sweet-grid">
          {sweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onEdit={isAdmin() ? handleEditSweet : null}
              onDelete={isAdmin() ? handleDelete : null}
              onPurchase={handlePurchase}
              onRestock={isAdmin() ? handleRestock : null}
            />
          ))}
        </div>
      )}

      {showForm && (
        <SweetForm
          sweet={editingSweet}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default SweetList;

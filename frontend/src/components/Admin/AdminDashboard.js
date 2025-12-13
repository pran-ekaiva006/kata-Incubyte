import React, { useEffect, useState } from 'react';
import sweetService from '../../services/sweetService';
import { useAuth } from '../../context/AuthContext';
import SweetForm from '../Sweet/SweetForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const data = await sweetService.getAllSweets();
      setSweets(data.sweets);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return <div style={{ padding: 32, textAlign: 'center' }}>Access denied.</div>;
  }

  const total = sweets.length;
  const outOfStock = sweets.filter(s => s.quantity === 0).length;
  const lowStock = sweets.filter(s => s.quantity > 0 && s.quantity < 10).length;

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Sweets</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value">{outOfStock}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock (&lt;10)</div>
          <div className="stat-value">{lowStock}</div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add New Sweet
        </button>
        {/* You can add a bulk restock modal here */}
      </div>

      {showForm && (
        <SweetForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchSweets();
          }}
        />
      )}

      <h3 style={{ marginTop: 32 }}>Inventory Overview</h3>
      {loading ? (
        <div className="loading"><span className="spinner" /> Loading...</div>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map(sweet => (
              <tr key={sweet._id}>
                <td>{sweet.name}</td>
                <td>{sweet.category}</td>
                <td>
                  {sweet.quantity === 0
                    ? <span style={{ color: '#c0392b' }}>Out of Stock</span>
                    : sweet.quantity < 10
                      ? <span style={{ color: '#b26a00' }}>Low: {sweet.quantity}</span>
                      : <span style={{ color: '#1a7f1a' }}>{sweet.quantity}</span>
                  }
                </td>
                <td>
                  {new Intl.NumberFormat(
                    navigator.language || 'en-US',
                    { style: 'currency', currency: (navigator.language && navigator.language.startsWith('en-IN')) ? 'INR' : 'USD' }
                  ).format(sweet.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
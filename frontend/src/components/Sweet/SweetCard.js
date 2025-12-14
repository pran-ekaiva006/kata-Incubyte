import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Sweet.css';

const categoryIcons = {
  Candy: '🍬',
  Chocolate: '🍫',
  Cookie: '🍪',
  Dessert: '🍰',
  Gum: '🍬',
  Beverage: '🥤',
  'Hard Candy': '🍭',
  Gummy: '🧸',
  Lollipop: '🍭',
  Other: '🍭'
};

const SweetCard = ({ sweet, onEdit, onDelete, onPurchase, onRestock }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handlePurchase = () => {
    if (purchaseQuantity > 0 && purchaseQuantity <= sweet.quantity) {
      addToCart(sweet, purchaseQuantity);  // Add to cart
      setShowPurchase(false);
      setPurchaseQuantity(1);
      alert(`Added ${purchaseQuantity} ${sweet.name}(s) to cart!`);  // Optional feedback
    }
  };

  const handleRestock = () => {
    if (restockQuantity > 0) {
      onRestock(sweet._id, restockQuantity);
      setShowRestock(false);
      setRestockQuantity(10);
    }
  };

  return (
    <div className="sweet-card">

      <div className="sweet-card-header">
        <h3>{sweet.name}</h3>
        <span className="category-badge">
          {categoryIcons[sweet.category] || ''} {sweet.category}
        </span>
      </div>
      
      <div className="sweet-card-body">
        <p className="sweet-description">
          {sweet.description || 'Delicious sweet treat!'}
        </p>

        <div className="sweet-details">
          <div className="price">
            <span className="price-label">Price:</span>
            <span className="price-value">
              {new Intl.NumberFormat(
                navigator.language || 'en-US',
                { style: 'currency', currency: (navigator.language && navigator.language.startsWith('en-IN')) ? 'INR' : 'USD' }
              ).format(sweet.price)}
            </span>
          </div>
          <div className="quantity">
            <span className="quantity-label">Stock:</span>
            {sweet.quantity === 0 ? (
              <span className="stock-indicator out-of-stock">Out of Stock</span>
            ) : sweet.quantity < 10 ? (
              <span className="stock-indicator low-stock">Low Stock: {sweet.quantity}</span>
            ) : (
              <span className="stock-indicator in-stock">In Stock: {sweet.quantity}</span>
            )}
          </div>
        </div>
      </div>

      <div className="sweet-card-actions">
        {/* Purchase buttons */}
        {isAuthenticated && !onEdit && (
          <>
            {!showPurchase ? (
              <button
                className="btn-purchase"
                onClick={() => setShowPurchase(true)}
                disabled={sweet.quantity === 0}
              >
                🛒 Purchase
              </button>
            ) : (
              <div className="purchase-form">
                <input
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
                />
                <button onClick={handlePurchase} className="btn-confirm">✓</button>
                <button onClick={() => setShowPurchase(false)} className="btn-cancel">✗</button>
              </div>
            )}
          </>
        )}

        {/* Admin buttons */}
        {onEdit && (
          <>
            <button className="btn-edit" onClick={() => onEdit(sweet)}>✏️ Edit</button>
            <button className="btn-delete" onClick={() => onDelete(sweet._id)}>🗑️ Delete</button>

            {!showRestock ? (
              <button className="btn-restock" onClick={() => setShowRestock(true)}>📦 Restock</button>
            ) : (
              <div className="restock-form">
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value))}
                />
                <button onClick={handleRestock} className="btn-confirm">✓</button>
                <button onClick={() => setShowRestock(false)} className="btn-cancel">✗</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SweetCard;

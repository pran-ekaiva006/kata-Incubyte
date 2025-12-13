import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Sweet.css';

const categoryIcons = {
  Candy: '🍬',
  Chocolate: '🍫',
  Cookie: '🍪',
  Dessert: '🍰',
  Gum: '🍬',
  Beverage: '🥤',
  Other: '🍭'
};

const SweetCard = ({ sweet, onEdit, onDelete, onPurchase, onRestock }) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  
  const { isAuthenticated } = useAuth();  // This is a boolean, not a function

  const handlePurchase = () => {
    if (purchaseQuantity > 0 && purchaseQuantity <= sweet.quantity) {
      onPurchase(sweet._id, purchaseQuantity);
      setShowPurchase(false);
      setPurchaseQuantity(1);
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
            <span className="price-value">${sweet.price.toFixed(2)}</span>
          </div>
          <div className="quantity">
            <span className="quantity-label">Stock:</span>
            <span className={`quantity-value ${sweet.quantity === 0 ? 'out-of-stock' : sweet.quantity < 10 ? 'low-stock' : ''}`}>
              {sweet.quantity}
            </span>
          </div>
        </div>
      </div>

      <div className="sweet-card-actions">
        {isAuthenticated && !onEdit && (  // Changed from isAuthenticated() to isAuthenticated
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
                <button onClick={handlePurchase} className="btn-confirm">
                  ✓
                </button>
                <button onClick={() => setShowPurchase(false)} className="btn-cancel">
                  ✗
                </button>
              </div>
            )}
          </>
        )}

        {onEdit && (
          <>
            <button className="btn-edit" onClick={() => onEdit(sweet)}>
              ✏️ Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(sweet._id)}>
              🗑️ Delete
            </button>
            
            {!showRestock ? (
              <button className="btn-restock" onClick={() => setShowRestock(true)}>
                📦 Restock
              </button>
            ) : (
              <div className="restock-form">
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value))}
                />
                <button onClick={handleRestock} className="btn-confirm">
                  ✓
                </button>
                <button onClick={() => setShowRestock(false)} className="btn-cancel">
                  ✗
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SweetCard;

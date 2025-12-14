import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import sweetService from '../../services/sweetService';
import './Cart.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <div className="cart-container"><div>Please log in to view your cart.</div></div>;
  }

  const handleCheckout = async () => {
    try {
      for (const item of cart) {
        await sweetService.purchaseSweet(item._id, item.quantity);
      }
      clearCart();
      alert('Purchase successful!');
      navigate('/');
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${item.price.toFixed(2)}</div>
                <div className="cart-item-quantity">
                  <span>Quantity:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                  />
                </div>
              </div>
              <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">Total: ${getTotalPrice().toFixed(2)}</div>
          <div className="cart-actions">
            <button className="cart-btn" onClick={handleCheckout}>Checkout</button>
            <button className="cart-btn clear" onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Layout.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  // Close menu on navigation (optional)
  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT — LOGO */}
        <div className="navbar-left">
          <Link to={isAuthenticated ? "/shop" : "/"} className="navbar-logo" onClick={handleNavClick}>
            🍬 Sweet Shop
          </Link>
        </div>
        {/* HAMBURGER FOR MOBILE */}
        <div className="navbar-hamburger" onClick={handleMenuToggle} aria-label="Open menu" tabIndex={0}>
          <span style={{ width: 24, height: 3, background: '#222', borderRadius: 2, display: 'block', margin: '4px 0' }} />
          <span style={{ width: 24, height: 3, background: '#222', borderRadius: 2, display: 'block', margin: '4px 0' }} />
          <span style={{ width: 24, height: 3, background: '#222', borderRadius: 2, display: 'block', margin: '4px 0' }} />
        </div>
        {/* RIGHT — MENU */}
        <div className={`navbar-right${menuOpen ? ' open' : ''}`}>
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                {user?.name ? `Welcome, ${user.name}` : 'Welcome'}
                {isAdmin() && <span className="admin-badge">Admin</span>}
              </span>
              {isAdmin() && (
                <Link to="/admin" className="navbar-link" onClick={handleNavClick}>
                  Admin Dashboard
                </Link>
              )}
              <Link to="/cart" className="navbar-link navbar-cart" onClick={handleNavClick}>
                🛒 Cart ({getTotalItems()})
              </Link>
              <button onClick={handleLogout} className="navbar-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" onClick={handleNavClick}>
                Login
              </Link>
              <Link to="/register" className="navbar-btn" onClick={handleNavClick}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

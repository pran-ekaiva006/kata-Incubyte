import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu on navigation (optional)
  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleNavClick}>
          🍬 Sweet Shop
        </Link>
        <button
          className="navbar-hamburger"
          aria-label="Toggle menu"
          onClick={handleMenuToggle}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
        <div className={`navbar-menu${menuOpen ? ' open' : ''}`}>
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Welcome, {user?.name}
                {isAdmin() && <span className="admin-badge">Admin</span>}
              </span>
              {isAdmin() && (
                <Link to="/admin" className="navbar-link" onClick={handleNavClick}>
                  Admin Dashboard
                </Link>
              )}
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

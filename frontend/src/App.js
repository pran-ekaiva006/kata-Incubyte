import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SweetList from './components/Sweet/SweetList';
import AdminDashboard from './components/Admin/AdminDashboard';
import CartPage from './components/Cart/CartPage';

import './App.css';

function AppContent() {
  const location = useLocation();
  const hideNavbar = (
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  );

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/shop" element={<SweetList />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

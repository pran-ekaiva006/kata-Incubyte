import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SweetList from './components/Sweet/SweetList';
import AdminDashboard from './components/Admin/AdminDashboard'; // Add this import
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<SweetList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} /> {/* Add this line */}
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

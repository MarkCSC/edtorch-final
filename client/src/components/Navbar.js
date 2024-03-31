// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import './Navbar.css';

function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">Edtorch</Link>
        <ul className="nav-links">
          {auth.user ? (
            // Links to show when user is logged in
            <>
              <li><Link to="/">Main Page</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/exercise">Exercise</Link></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Links to show when no user is logged in
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/create-account">Create Account</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
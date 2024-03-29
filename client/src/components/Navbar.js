// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext.js'
import './Navbar.css'

function Navbar() {
  
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login'); // Redirect to login after logout
  };
  
  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">Edtorch</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><Link to="/">Main Page</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/exercise">Exercise</Link></li>
          <li><Link to="/create-account">Create Account</Link></li>
          <li>
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
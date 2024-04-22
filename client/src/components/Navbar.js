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

  // Render navigation links based on the user's role
  const renderLinks = () => {
    if (!auth.user) {
      return (
        <>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/create-account">Create Account</Link></li>
        </>
      );
    } else if (auth.user.role === 'teacher') {
      return (
        <>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/create-homework">Create Homework</Link></li>
          {/* <li><Link to="/review-assignments">Review Assignments</Link></li> */}
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </>
      );
    } else if (auth.user.role === 'student') {
      return (
        <>
          <li><Link to="/">Main Page</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/exercise">Exercise</Link></li>
          <li><Link to="/finish-homework">Homework</Link></li>
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        </>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">Edtorch</Link>
        <ul className="nav-links">
          {renderLinks()}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
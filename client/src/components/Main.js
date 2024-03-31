// src/components/Main.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Main.css';

function Main() {
  return (
    <div className="main-container">
      <header className="main-header">
        <h1>Welcome to Edtorch</h1>
        <p>Sharpen your math skills with generative AI</p>
      </header>
      
      <div className="button-group">
        <Link to="/create-account" className="button student-button">I'm a Student</Link>
        <Link to="/join-us" className="button teacher-button">I'm a Teacher</Link>
      </div>
    </div>
  );
}

export default Main;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../hooks/AuthContext';
import './Login.css'

function Login() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Here you would typically handle the form submission,
    // e.g., by sending a request to your server for authentication.

    try {

      await auth.login(email, password)
      // Redirect user to the dashboard or home page after login
      navigate('/home'); // Use the navigate function with the desired route
      
    } catch (err) {
      setError(err.response?.data?.message || 'Unexpected error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    auth.user?
    <div className='container'>
      <p>You are logged in as {auth.user.username}</p>
    </div>
    :
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          {error && <div className="error">{error}</div>}
        </div>
        <button type="submit" className="submit-button">Log In</button>
      </form>
    </div>
  );
}

export default Login;
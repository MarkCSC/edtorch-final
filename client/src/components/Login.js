import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import axios from 'axios';

import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      validationErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8000/api/user/login', {formData: formData});

        // Save the token in localStorage or context/state management
        localStorage.setItem('token', response.data.token);

        // Decode the token and set the user state
        const token = localStorage.getItem('token');

        const decoded = auth.parseJwt(token);
        if (decoded) {
          auth.setUser(decoded);
        }
        alert('Login successful! Redirecting...');
        navigate('/exercise');

      } catch (error) {
        const errorResponse = error.response;
        const generalError = errorResponse && errorResponse.status === 401
          ? "Invalid email or password. Please try again."
          : "An error occurred. Please try again later.";

        setErrors({ general: generalError });
        console.error('Error:', errorResponse ? errorResponse.data : error.message);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-describedby="emailError"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p id="emailError" className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            aria-describedby="passwordError"
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <p id="passwordError" className="error">{errors.password}</p>}
        </div>
        
        <div>
          {errors.general && <p className="error">{errors.general}</p>}
        </div>
        
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
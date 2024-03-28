import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create a context for the authentication state
const AuthContext = createContext(null);

// Export a hook to access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};


// Define a function to parse the JWT and return the user object
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// AuthProvider component that wraps your app and provides the AuthContext
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // You would replace this with actual logic to check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // Here we're just checking if the token is present
    // maybe we can add auth for teacher later
    
    return token != null;
  };

  const login = async (email, password) => {

    try {
      const response = await axios.post('http://localhost:8000/api/user/login', {
        email,
        password,
      });

      console.log('Login success:', response.data);
      // Save the token in localStorage or context/state management
      localStorage.setItem('token', response.data.token);

      // Decode the token and set the user state
      const token = localStorage.getItem('token');

      const decoded = parseJwt(token);
      if (decoded) {
        setUser(decoded);
      }
    } catch (error) {
      // Handle errors: Axios wraps the response error in error.response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Login failed:', error.response.data);
        // You can further process the error, display a message, etc.
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    }
  };

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Set the user state to null to reflect the logout
    setUser(null);
    
    // If using React Router, you might want to redirect the user to the login page
    // This would be done in the component that calls logout
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState('');
  const auth = useAuth();

  useEffect(() => {
    const fetchHomeworkCodes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/homework/get-homework-codes', {
          headers: {
            'Authorization': auth.getToken(),
          }
        });
        setCodes(response.data);
      } catch (err) {
        setError('Error fetching homework codes');
        console.error(err);
      }
    };

    fetchHomeworkCodes();
  }, [auth]);

  if (error) {
    return <div className="homework-container error">{error}</div>;
  }

  if (!codes.length) {
    return <div className="homework-container loading">No homework codes found...</div>;
  }

  return (
    <div className="homework-container">
      <ul>
        {codes.map((code, index) => (
          <li key={index}>{code}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/AuthContext';
import './Profile.css'; // Make sure the CSS file is correctly referenced

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const auth = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile/get-profile', {
          headers: {
            'Authorization': auth.getToken(),
          }
        });
        setUser(response.data);
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      }
    };

    fetchProfile();
  }, [auth]);

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  if (!user) {
    return <div className="profile-container loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>
      <div className="profile-info">
        <label>Username</label>
        <div>{user.username}</div>

        <label>Email</label>
        <div>{user.email}</div>

        <label>Role</label>
        <div>{user.role}</div>

        <label>First Name</label>
        <div>{user.firstName}</div>

        <label>Last Name</label>
        <div>{user.lastName}</div>

        <label>School</label>
        <div>{user.school}</div>

        <label>Grade</label>
        <div>{user.grade}</div>

        <label>Account Created</label>
        <div>{new Date(user.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default UserProfile;
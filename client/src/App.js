// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Exercise from './components/Exercise.js';
import CreateAccount from './components/CreateAccount';
import Main from './components/Main.js';
import JoinUs from './components/JoinUs.js'
import { AuthProvider } from './hooks/AuthContext.js'; // Import your AuthProvider
import { RequireAuth } from './hooks/RequireAuth.js'; // Import your RequireAuth component
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/join-us" element={<JoinUs />} />
          {/* Other routes can be added here */}
          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/exercise"
            element={
              <RequireAuth>
                <Exercise />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
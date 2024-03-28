// src/components/Home.js
import React from 'react';
import {useAuth} from '../hooks/AuthContext.js'

function Home() {
  const auth = useAuth();

  console.log(auth.user);

  // Ensure that auth and auth.user are defined before accessing auth.user.role
  const userRole = auth && auth.user ? auth.user.role : null;

  // Optional: Handle the loading state or check if a user is not logged in
  if (!auth || !auth.user) {
    return <div>Loading or user not logged in...</div>;
  }

  return (
    userRole === 'student'?(
      <div>
        <h1>home page for student after login</h1>
        <p>The platform for student exercises and learning. Welcome back!</p>
      </div>
    ):(
      <div>
        <h1>home page for teacher after login</h1>
        <p>The platform for teacher to evaluate their teaching. Welcome back!</p>
      </div>
    )
  );
}

export default Home;
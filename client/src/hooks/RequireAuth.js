import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const RequireAuth = ({ children, role}) => {
  const auth = useAuth();
  const location = useLocation(); // Add this line to get the current location

  // if (!auth.isAuthenticated()) {
  
  console.log(`this is auth.user in requireauth ${auth.user}`)

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.

    return <Navigate 
      to="/login" 
      replace 
      state={{ from: location, message: 'You must be logged in to view this page.' }}
    />
    
  }

  if (role && auth.user.role !== role) {
    // If role is specified and does not match the user's role, redirect or show an error page
    return <Navigate to="/" replace />;
  }

  return children;
};
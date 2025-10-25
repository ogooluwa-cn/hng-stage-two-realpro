import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const session = localStorage.getItem("userSession");
    if (!session) return false;

    try {
      const userSession = JSON.parse(session);
      return userSession && 
             userSession.token && 
             userSession.expires > Date.now();
    } catch {
      return false;
    }
  };

  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/page/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
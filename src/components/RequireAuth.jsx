import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function RequireAuth({ children }) {
  const { user } = useContext(UserContext); // Access the logged-in user state

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children; // Render the child components if the user is authenticated
}

export default RequireAuth;
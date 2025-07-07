import React from "react";
import { Navigate } from "react-router-dom";
import token from "@/lib/utilities";

const PublicRoute = ({ children }) => {
  if (token.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;

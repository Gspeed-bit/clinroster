import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AdminRoute: React.FC = () => {
  const { state } = useAuth();
  const location = useLocation();

  if (state.isLoading) return null; // or a spinner

  if (!state.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (state.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Route guard. If no token, redirect to /login.
 * Use like:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/" element={<Dashboard />} />
 * </Route>
 */
export const ProtectedRoute: React.FC = () => {
  const { state } = useAuth();
  const location = useLocation();

  if (state.isLoading) return null;
  if (!state.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

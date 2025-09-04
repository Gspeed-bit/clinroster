import React from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { LoginPage } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { UsersPage } from "@/pages/admin/UsersPage";
import { NotFound } from "@/pages/NotFound";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected (any authenticated user) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      {/* Admin-only */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

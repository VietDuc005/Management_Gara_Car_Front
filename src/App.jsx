import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext"; // 1. Import ToastProvider

// Auth components
import Login from "./components/auth/Login";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import ServiceTypeManagement from "./pages/ServiceTypeManagement";

// ===================== ProtectedRoute Component =====================
const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/login" replace />;

  return <Outlet />;
};

// ===================== Main App =====================
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 2. Bao bọc toàn bộ ứng dụng bằng ToastProvider */}
        <ToastProvider>
          <Routes>
            {/* --- Public routes --- */}
            <Route path="/login" element={<Login />} />

            {/* --- Protected routes --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                {/* Redirect from root to dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/service-types"
                  element={<ServiceTypeManagement />}
                />

                {/* --- Admin only --- */}
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

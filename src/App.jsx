import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Auth components
import Login from "./components/auth/Login";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import ServiceTypeManagement from "./pages/ServiceTypeManagement";
import CustomerManagement from "./pages/CustomerManagement";
import RepairManagement from "./pages/RepairManagement";
// Thêm các trang khác vào đây khi bạn phát triển

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
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* --- Protected routes --- */}
            <Route element={<ProtectedRoute />}>
              {/* Layout sẽ là route cha, chứa Sidebar và Header */}
              <Route path="/" element={<Layout />}>
                {/* Trang mặc định sẽ là service-types */}
                <Route
                  index
                  element={<Navigate to="/service-types" replace />}
                />

                {/* Định nghĩa các trang con */}
                <Route
                  path="service-types"
                  element={<ServiceTypeManagement />}
                />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="repairs" element={<RepairManagement />} />

                {/* Thêm các route khác vào đây khi bạn phát triển */}
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

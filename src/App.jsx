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
import { CartProvider } from "./context/CartContext";

// Auth components
import Login from "./components/auth/Login";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import InvoiceManagement from "./pages/InvoiceManagement";
import ServiceTypeManagement from "./pages/ServiceTypeManagement";
import CustomerManagement from "./pages/CustomerManagement";
import MachineManagement from "./pages/MachineManagement";
import ServiceManagement from "./pages/ServiceManagement";
import ServiceDetail from "./pages/ServiceDetail";
import SalesManagement from "./pages/SalesManagement";
import VehicleManagement from "./pages/VehicleMangement";
import RepairManagement from "./pages/RepairManagement";
import ServiceSalesDetail from "./pages/ServiceSalesDetail";
import AuthManagement from "./pages/AuthManagement";
import AccessDenied from "./components/auth/AccessDenied"; // Component thông báo không có quyền

// ===================== ProtectedRoute Component =====================
const ProtectedRoute = ({ requireManager = false }) => {
  const { user, isManager, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> chuyển về login
  if (!user) return <Navigate to="/login" replace />;

  // Yêu cầu quyền Quản lý nhưng user không phải Quản lý
  if (requireManager && !isManager()) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

// ===================== Main App =====================
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* --- Protected routes --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  {/* Trang mặc định */}
                  <Route index element={<Navigate to="/dashboard" replace />} />

                  {/* Các trang KHÔNG yêu cầu quyền Quản lý */}
                  <Route path="invoice" element={<InvoiceManagement />} />
                  <Route
                    path="service-types"
                    element={<ServiceTypeManagement />}
                  />
                  <Route path="customers" element={<CustomerManagement />} />
                  <Route path="machine" element={<MachineManagement />} />
                  <Route path="repairs" element={<RepairManagement />} />
                  <Route path="services" element={<ServiceManagement />} />
                  <Route path="services/:id" element={<ServiceDetail />} />
                  <Route path="vehicles" element={<VehicleManagement />} />
                  <Route path="sales" element={<SalesManagement />} />
                  <Route
                    path="sales/services/:id"
                    element={<ServiceSalesDetail />}
                  />
                </Route>
              </Route>

              {/* --- Routes YÊU CẦU quyền Quản lý --- */}
              <Route element={<ProtectedRoute requireManager={true} />}>
                <Route path="/" element={<Layout />}>
                  {/* Trang Thống kê (Dashboard) - CHỈ Quản lý */}
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Trang Quản lý Tài khoản - CHỈ Quản lý */}
                  <Route path="auth" element={<AuthManagement />} />
                </Route>
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

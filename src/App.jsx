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
import { CartProvider } from "./context/CartContext"; // ✅ 1. Import CartProvider

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
import VehicleManagement from "./pages/VehicleMangement"; // Giữ nguyên tên file sai
import RepairManagement from "./pages/RepairManagement";
import ServiceSalesDetail from "./pages/ServiceSalesDetail"; // ✅ 2. Import trang chi tiết mới
import AuthManagement from "./pages/AuthManagement";

// ===================== ProtectedRoute Component =====================
const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, isAdmin, loading } = useAuth();

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
          <CartProvider>
            {" "}
            {/* ✅ 3. Bọc ứng dụng trong CartProvider */}
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* --- Protected routes --- */}
              <Route element={<ProtectedRoute />}>
                {/* Layout sẽ là route cha, chứa Sidebar và Header */}
                <Route path="/" element={<Layout />}>
                  {/* Trang mặc định */}
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  {/* Định nghĩa các trang con */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="invoice" element={<InvoiceManagement />} />{" "}
                  {/* Sửa lại path */}
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
                  <Route path="auth" element={<AuthManagement />} />
                  {/* ✅ 4. Thêm route cho trang chi tiết bán hàng */}
                  <Route
                    path="sales/services/:id"
                    element={<ServiceSalesDetail />}
                  />
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

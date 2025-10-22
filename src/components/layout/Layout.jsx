// src/components/layout/Layout.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AuthContext } from "../../context/AuthContext";

// Ánh xạ đường dẫn sang tiêu đề trang
const pageTitles = {
  "/service-types": "Quản lý Loại Dịch vụ",
  "/customers": "Quản lý Khách hàng",
};

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Lấy tiêu đề dựa trên đường dẫn URL
  const getPageTitle = () => {
    return pageTitles[location.pathname] || "Garage Manager";
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar giờ sẽ dùng NavLink để điều hướng và không cần activeTab nữa */}
      <Sidebar
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header title={getPageTitle()} />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50">
          {/* Outlet là nơi router sẽ render trang con tương ứng */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

// src/components/layout/Layout.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AuthContext } from "../../context/AuthContext";

// Ánh xạ đường dẫn sang tiêu đề trang
const pageTitles = {
  "/service-types": "Quản lý Loại Dịch vụ",
  "/customers": "Quản lý Khách hàng",
  "/machine": "Quản lý Thợ",
  "/repairs": "Quản lý Phiếu sửa chữa",
};

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ===================== DARK MODE =====================
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Đồng bộ theme nếu người dùng thay đổi từ Sidebar
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme]);

  // ===================== LOGOUT =====================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ===================== TITLE =====================
  const getPageTitle = () => {
    return pageTitles[location.pathname] || "Garage Manager";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
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
        {/* Header */}
        <Header title={getPageTitle()} />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-800 rounded-tl-xl transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

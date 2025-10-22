// src/components/layout/Layout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AuthContext } from "../../context/AuthContext";

import ServiceTypeManagement from "../../pages/ServiceTypeManagement";

const Layout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false); 
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Render trang hiện tại
  const renderContent = () => {
    switch (activeTab) {
      
      case "serviceTypes":
        return <ServiceTypeManagement />;
      default:
        return <ServiceTypeManagement />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "serviceTypes": return "Quản lý Loại Dịch vụ";
      default: return "";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar cố định */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Phần nội dung chính tự dịch theo sidebar */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header title={getPageTitle()} />
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;

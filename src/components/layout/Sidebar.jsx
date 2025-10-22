import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Wrench,
  Package,
  Car,
  Users,
  Briefcase,
  CreditCard,
  LogOut,
  Menu,
  Layers,
} from "lucide-react";

function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  collapsed,
  setCollapsed,
}) {
  const menuItemsMain = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "sales", label: "Bán hàng", icon: <ShoppingCart size={20} /> },
  ];

  const menuItemsManage = [
    { id: "invoices", label: "Hóa đơn", icon: <FileText size={20} /> },
    { id: "repairs", label: "Phiếu sửa chữa", icon: <Wrench size={20} /> },
    { id: "serviceTypes", label: "Loại Dịch vụ", icon: <Layers size={20} /> },
    { id: "services", label: "Dịch vụ", icon: <Package size={20} /> },
    { id: "vehicles", label: "Phương tiện", icon: <Car size={20} /> },
    { id: "customers", label: "Khách hàng", icon: <Users size={20} /> },
    { id: "mechanics", label: "Thợ sửa xe", icon: <Wrench size={20} /> },
    { id: "employees", label: "Nhân viên", icon: <Briefcase size={20} /> },
  ];

  const menuItemsSystem = [
    { id: "payments", label: "Thanh toán", icon: <CreditCard size={20} /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between
      bg-white border-r shadow-sm z-40 transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* --- PHẦN TRÊN --- */}
      <div className="flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <h1 className="text-xl font-bold text-orange-500 truncate">
              Garage Manager
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 hover:text-orange-500 transition"
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* === PHẦN CHÍNH === */}
        <nav className="px-3 pt-3">
          {menuItemsMain.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg mb-1 font-medium transition-all duration-150 ${
                activeTab === item.id
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* --- QUẢN LÝ --- */}
        {!collapsed && (
          <div className="text-xs text-gray-500 uppercase font-semibold px-4 mt-4 mb-2">
            Quản lý
          </div>
        )}
        <nav className="px-3">
          {menuItemsManage.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg mb-1 font-medium transition-all duration-150 ${
                activeTab === item.id
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* --- HỆ THỐNG --- */}
        {!collapsed && (
          <div className="text-xs text-gray-500 uppercase font-semibold px-4 mt-4 mb-2">
            Hệ thống
          </div>
        )}
        <nav className="px-3 mb-4">
          {menuItemsSystem.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg mb-1 font-medium transition-all duration-150 ${
                activeTab === item.id
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* --- NÚT ĐĂNG XUẤT --- */}
      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={onLogout}
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-start gap-3"
          } w-full py-2 font-semibold text-red-600 border border-red-200 rounded-lg 
          hover:bg-red-50 transition-all duration-200`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

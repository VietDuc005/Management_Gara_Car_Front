import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import { Users, Layers, LogOut, Menu, Wrench } from "lucide-react";

function Sidebar({ onLogout, collapsed, setCollapsed }) {
  // Chỉ giữ lại các menu bạn đã làm
  const menuItemsManage = [
    {
      path: "/service-types",
      label: "Loại Dịch vụ",
      icon: <Layers size={20} />,
    },
    { path: "/customers", label: "Khách hàng", icon: <Users size={20} /> },
    { path: "/repairs", label: "Phiếu sửa chữa", icon: <Wrench size={20} /> },
  ];

  // Hàm để xác định class cho NavLink đang active
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg mb-1 font-medium transition-all duration-150 ${
      isActive
        ? "bg-orange-500 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between
      bg-white border-r shadow-sm z-40 transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-64"}`}
    >
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

        {/* Menu Items */}
        <nav className="px-3 pt-3">
          {menuItemsManage.map((item) => (
            <NavLink key={item.path} to={item.path} className={getNavLinkClass}>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Nút Đăng xuất */}
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

import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Layers,
  LogOut,
  Menu,
  Sun,
  Moon,
  Car,
  FileText,
} from "lucide-react";

function Sidebar({ onLogout, collapsed, setCollapsed }) {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const menuTop = [
    {
      path: "/dashboard",
      label: "Trang chủ",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/sales",
      label: "Bán hàng",
      icon: <Users size={20} />,
    },
  ];

  const menuBottom = [
    { path: "/invoice", label: "Hóa đơn", icon: <FileText size={20} /> },
    { path: "/service-types", label: "Loại Dịch vụ", icon: <Layers size={20} /> },
    { path: "/customers", label: "Khách hàng", icon: <Users size={20} /> },
    { path: "/machine", label: "Thợ", icon: <Wrench size={20} /> },
    { path: "/repairs", label: "Phiếu sửa chữa", icon: <FileText size={20} /> },
    { path: "/services", label: "Dịch vụ", icon: <FileText size={20} /> },
    { path: "/vehicles", label: "Phương tiện", icon: <Car size={20} /> },
  ];

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg mb-1 font-medium transition-all duration-150 ${
      isActive
        ? "bg-orange-500 text-white shadow-sm"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between
      bg-white dark:bg-gray-900 border-r shadow-sm z-40 transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          {!collapsed && (
            <h1 className="text-xl font-bold text-orange-500 truncate">
              Garage Manager
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="px-3 pt-3">
          {/* Group Top */}
          {menuTop.map((item) => (
            <NavLink key={item.path} to={item.path} className={getNavLinkClass}>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}

          {/* Divider */}
          {!collapsed && (
            <div className="my-4 border-t border-gray-300 dark:border-gray-700" />
          )}

          {/* Group Bottom */}
          {menuBottom.map((item) => (
            <NavLink key={item.path} to={item.path} className={getNavLinkClass}>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Theme + Logout */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-3">
        <button
          onClick={toggleTheme}
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-start gap-3"
          } w-full py-2 font-semibold rounded-lg border border-gray-300 dark:border-gray-600
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200`}
        >
          {theme === "dark" ? (
            <>
              <Sun size={18} className="text-yellow-400" />
              {!collapsed && <span>Chế độ sáng</span>}
            </>
          ) : (
            <>
              <Moon size={18} className="text-gray-800" />
              {!collapsed && <span>Chế độ tối</span>}
            </>
          )}
        </button>

        <button
          onClick={onLogout}
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-start gap-3"
          } w-full py-2 font-semibold text-red-600 border border-red-200 rounded-lg 
          hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

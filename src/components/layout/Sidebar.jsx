import React, { useCallback } from "react";
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
  ShoppingCart,
  User,
  UserCog,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ onLogout, collapsed, setCollapsed }) {
  const { isManager } = useAuth();
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Debounce toggle collapse để tránh ResizeObserver error
  const handleToggleCollapse = useCallback(() => {
    requestAnimationFrame(() => {
      setCollapsed(!collapsed);
    });
  }, [collapsed, setCollapsed]);

  // ========= MENU STRUCTURE ========= //
  const sectionMenu = [
    {
      title: null,
      items: [
        {
          path: "/dashboard",
          label: "Trang chủ",
          icon: <LayoutDashboard size={20} />,
          requireManager: true,
        },
        {
          path: "/sales",
          label: "Bán hàng",
          icon: <ShoppingCart size={20} />,
          requireManager: false,
        },
      ],
    },
    {
      title: "QUẢN LÝ",
      items: [
        {
          path: "/invoice",
          label: "Hóa đơn",
          icon: <FileText size={20} />,
          requireManager: false,
        },
        {
          path: "/service-types",
          label: "Loại Dịch vụ",
          icon: <Layers size={20} />,
          requireManager: false,
        },
        {
          path: "/customers",
          label: "Khách hàng",
          icon: <User size={20} />,
          requireManager: false,
        },
        {
          path: "/machine",
          label: "Thợ",
          icon: <UserCog size={20} />,
          requireManager: false,
        },
        {
          path: "/repairs",
          label: "Phiếu sửa chữa",
          icon: <Wrench size={20} />,
          requireManager: false,
        },
        {
          path: "/services",
          label: "Dịch vụ",
          icon: <FileText size={20} />,
          requireManager: false,
        },
        {
          path: "/vehicles",
          label: "Phương tiện",
          icon: <Car size={20} />,
          requireManager: false,
        },
      ],
    },
    {
      title: "HỆ THỐNG",
      items: [
        {
          path: "/auth",
          label: "Tài khoản",
          icon: <Users size={20} />,
          requireManager: true,
        },
      ],
    },
  ];

  const getNavLinkClass = ({ isActive }, isLocked) => {
    if (isLocked) {
      return `flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg font-medium 
              bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60`;
    }

    return `flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-150 ${
      isActive
        ? "bg-orange-500 text-white shadow-sm"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;
  };

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
            onClick={handleToggleCollapse}
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition"
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Render Sections */}
        <nav className="px-3 pt-3 space-y-4">
          {sectionMenu.map((section, idx) => (
            <div key={idx}>
              {section.title && !collapsed && (
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 px-2 mb-2 uppercase tracking-wide">
                  {section.title}
                </p>
              )}

              {section.items.map((item) => {
                const isLocked = item.requireManager && !isManager();

                if (isLocked) {
                  return (
                    <div
                      key={item.path}
                      className={getNavLinkClass({ isActive: false }, true)}
                      title="Chỉ dành cho Quản lý"
                    >
                      {item.icon}
                      {!collapsed && (
                        <>
                          <span>{item.label}</span>
                          <Lock size={14} className="ml-auto" />
                        </>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={(navData) => getNavLinkClass(navData, false)}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Theme + Logout */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-3">
        {/* Dark / Light Toggle */}
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

        {/* Logout */}
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

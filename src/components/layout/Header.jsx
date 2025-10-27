import React from "react";
import { useAuth } from "../../context/AuthContext";
import { RefreshCcw } from "lucide-react";

const Header = ({ title }) => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("vi-VN");

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Chào mừng trở lại đến hệ thống{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {user?.tenDangNhap}

          </span>
        </p>
      </div>

      {/* Ngày + Reload + Avatar */}
      <div className="flex items-center gap-4">
       

        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Hôm nay</p>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {today}
          </p>
        </div>

       <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-full bg-orange-500 text-white shadow-sm 
          hover:bg-orange-600 active:scale-95 transition flex items-center justify-center"
          title="Tải lại trang"
        >
          <RefreshCcw size={18} />
        </button>
        
      </div>
    </header>
  );
};

export default Header;

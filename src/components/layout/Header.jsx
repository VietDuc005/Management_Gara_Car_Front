import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title }) => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("vi-VN");

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      {/* Tiêu đề trang động */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Chào mừng trở lại,{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {user?.username}
          </span>
        </p>
      </div>

      {/* Ngày & Avatar */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Hôm nay</p>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {today}
          </p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg shadow-sm">
          {user?.username?.charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import { Search, ChevronDown } from "lucide-react";

/**
 * Component tìm kiếm có dropdown chọn trường + tự động hiển thị trạng thái theo module.
 * @param {string} module - Tên module: "service" | "invoice" | "repair"
 */
const SearchWithOptions = ({
  searchField,
  searchTerm,
  onSearchFieldChange,
  onSearchTermChange,
  options = [],
  placeholder = "Nhập để tìm kiếm...",
  module = "",
}) => {
  // 🔹 Xác định danh sách trạng thái tùy module
  const getStatusOptions = () => {
    switch (module) {
      case "service":
        return ["Còn hàng", "Hết hàng", "Ngừng kinh doanh", "Đã xóa"];
      case "invoice":
        return ["Đã thanh toán", "Chưa thanh toán"];
      case "repair":
        return ["Chờ xử lý", "Đang sửa", "Hoàn thành", "Đã giao", "Hủy sửa"];
      default:
        return ["Hoạt động", "Đã xóa"];
    }
  };

  const statusOptions = getStatusOptions();

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {/* Dropdown chọn trường tìm kiếm */}
      <div className="relative">
        <select
          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
          className="appearance-none h-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none 
                     focus:border-orange-500 font-medium transition-colors duration-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 
                        text-gray-700 dark:text-gray-300">
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Ô nhập hoặc dropdown trạng thái */}
      <div className="flex-1 max-w-md relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={20}
        />

        {searchField === "trangThai" ? (
          <select
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                       appearance-none transition-colors duration-300"
          >
            <option value="">-- Chọn trạng thái --</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                       focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                       transition-colors duration-300"
          />
        )}
      </div>
    </div>
  );
};

export default SearchWithOptions;

import React from "react";
import { ChevronDown, ArrowDownUp } from "lucide-react";

/**
 * Component điều khiển sắp xếp (hỗ trợ dark mode)
 * @param {object} props
 * @param {object} props.sortConfig - Cấu hình sắp xếp hiện tại { sortBy, sortDirection }
 * @param {function} props.onSortChange - Hàm callback khi thay đổi sắp xếp
 * @param {Array<object>} props.options - Các tùy chọn để sắp xếp [{ value, label }]
 */
const SortControls = ({ sortConfig, onSortChange, options = [] }) => {
  const handleSortByChange = (e) => {
    onSortChange({ ...sortConfig, sortBy: e.target.value });
  };

  const toggleSortDirection = () => {
    const newDirection = sortConfig.sortDirection === "asc" ? "desc" : "asc";
    onSortChange({ ...sortConfig, sortDirection: newDirection });
  };

  return (
    <div className="flex items-center gap-4">
      {/* Dropdown chọn trường sắp xếp */}
      <div className="relative">
        <select
          value={sortConfig.sortBy}
          onChange={handleSortByChange}
          className="appearance-none w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-orange-500 transition-colors duration-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <ChevronDown size={18} />
        </div>
      </div>

      {/* Nút đổi chiều sắp xếp */}
      <button
        onClick={toggleSortDirection}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
        title={
          sortConfig.sortDirection === "asc"
            ? "Sắp xếp giảm dần"
            : "Sắp xếp tăng dần"
        }
      >
        <ArrowDownUp size={16} />
        <span>
          {sortConfig.sortDirection === "asc" ? "Tăng dần" : "Giảm dần"}
        </span>
      </button>
    </div>
  );
};

export default SortControls;

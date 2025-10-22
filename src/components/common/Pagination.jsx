import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Component phân trang nâng cao (hỗ trợ Dark Mode)
 * @param {object} props
 * @param {number} props.currentPage - Trang hiện tại (bắt đầu từ 0)
 * @param {number} props.totalPages - Tổng số trang
 * @param {function} props.onPageChange - Hàm callback khi chuyển trang
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputValue, setInputValue] = useState(currentPage + 1);

  useEffect(() => {
    setInputValue(currentPage + 1);
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputValue, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber - 1);
    } else {
      setInputValue(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6 text-gray-700 dark:text-gray-200 transition-colors duration-300">
      {/* Nút về trang đầu */}
      <button
        onClick={() => handlePageClick(0)}
        disabled={currentPage === 0}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        title="Trang đầu"
      >
        <ChevronsLeft size={18} />
      </button>

      {/* Nút lùi 1 trang */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        title="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Hiển thị & nhập số trang */}
      <div className="font-medium flex items-center gap-2">
        <span>Trang</span>
        <form onSubmit={handleGoToPage}>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleGoToPage}
            className="w-14 text-center border border-gray-300 dark:border-gray-600 rounded-md py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300"
            min="1"
            max={totalPages}
          />
        </form>
        <span>/ {totalPages}</span>
      </div>

      {/* Nút tiến 1 trang */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        title="Trang sau"
      >
        <ChevronRight size={18} />
      </button>

      {/* Nút về trang cuối */}
      <button
        onClick={() => handlePageClick(totalPages - 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        title="Trang cuối"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;

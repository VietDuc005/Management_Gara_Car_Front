import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Component phân trang nâng cao
 * @param {object} props
 * @param {number} props.currentPage - Trang hiện tại (bắt đầu từ 0)
 * @param {number} props.totalPages - Tổng số trang
 * @param {function} props.onPageChange - Hàm callback khi chuyển trang
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // State để quản lý giá trị trong ô input
  const [inputValue, setInputValue] = useState(currentPage + 1);

  // Cập nhật giá trị input khi trang hiện tại thay đổi từ bên ngoài
  useEffect(() => {
    setInputValue(currentPage + 1);
  }, [currentPage]);

  if (totalPages <= 1) {
    return null; // Không hiển thị nếu chỉ có 1 trang
  }

  // Logic cũ được giữ nguyên
  const handlePageClick = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  // Logic mới cho ô input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputValue, 10);
    // Kiểm tra xem số nhập vào có hợp lệ không
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber - 1); // Chuyển đổi về index (bắt đầu từ 0)
    } else {
      // Nếu không hợp lệ, reset lại giá trị input
      setInputValue(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Nút về trang đầu */}
      <button
        onClick={() => handlePageClick(0)}
        disabled={currentPage === 0}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        title="Trang đầu"
      >
        <ChevronsLeft size={18} />
      </button>

      {/* Nút lùi 1 trang (logic cũ) */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        title="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Hiển thị và nhập số trang */}
      <div className="text-gray-700 font-medium flex items-center gap-2">
        <span>Trang</span>
        <form onSubmit={handleGoToPage}>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleGoToPage} // Cũng có thể thực hiện khi người dùng click ra ngoài
            className="w-14 text-center border border-gray-300 rounded-md py-1 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            min="1"
            max={totalPages}
          />
        </form>
        <span>/ {totalPages}</span>
      </div>

      {/* Nút tiến 1 trang (logic cũ) */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        title="Trang sau"
      >
        <ChevronRight size={18} />
      </button>

      {/* Nút về trang cuối */}
      <button
        onClick={() => handlePageClick(totalPages - 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        title="Trang cuối"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;

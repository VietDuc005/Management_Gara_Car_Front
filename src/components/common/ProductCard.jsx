import React from "react";
import { API_BASE_URL } from "../../utils/constants";

const ProductCard = ({ item, onAddToCart, onViewDetails }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Ảnh sản phẩm */}
      <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {item.image ? (
          <img
            src={`${API_BASE_URL}${item.image}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Tên sản phẩm */}
        <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 truncate">
          {item.name}
        </h3>

        {/* ✅ Hiển thị Tồn kho và Giá trên các dòng riêng biệt */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Tồn kho:{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {item.soLuongTon}
          </span>
        </p>

        <p className="text-lg font-bold text-orange-600 mt-1">
          {item.priceText}
        </p>

        {/* Khu vực nút bấm */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t dark:border-gray-700">
          <button
            onClick={() => onViewDetails(item)}
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 transition"
          >
            Xem chi tiết
          </button>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

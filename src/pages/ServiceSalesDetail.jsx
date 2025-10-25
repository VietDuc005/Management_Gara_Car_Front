import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { API_BASE_URL } from "../utils/constants";
import { formatCurrency } from "../utils/helpers";

const ServiceSalesDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const product = location.state?.productData;

  useEffect(() => {
    if (!product) {
      navigate("/sales");
    }
  }, [product, navigate]);

  if (!product) {
    return <div className="p-6">Đang chuyển hướng...</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <button
        onClick={() => navigate("/sales")}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 mb-6"
      >
        <ArrowLeft size={18} />
        Quay lại trang bán hàng
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Cột trái: Hình ảnh (chiếm 2/5) */}
        <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center p-4 aspect-square">
          {product.image ? (
            <img
              src={`${API_BASE_URL}${product.image}`}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-md"
            />
          ) : (
            <span className="text-gray-400">Không có ảnh</span>
          )}
        </div>

        {/* Cột phải: Thông tin (chiếm 3/5) */}
        <div className="lg:col-span-3 flex flex-col">
          {/* ✅ Hiển thị Loại dịch vụ */}
          <p className="text-sm font-semibold text-orange-500">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">
            {product.name}
          </h1>

          <p className="text-4xl font-bold text-orange-600 my-6">
            {formatCurrency(product.price)}
          </p>

          {/* ✅ Khối thông tin Tồn kho, Đã bán, Trạng thái */}
          <div className="space-y-2 text-sm border-t border-b py-4 dark:border-gray-700">
            <p className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Tồn kho:</span>
              <span className="font-semibold">{product.soLuongTon}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Đã bán:</span>
              <span className="font-semibold">{product.soLuongBan || 0}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Trạng thái:
              </span>
              <span className="font-semibold text-green-600">
                {product.status}
              </span>
            </p>
          </div>

          {/* ✅ Khối Mô tả */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200">
              Mô tả chi tiết
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
              {product.moTa || "Chưa có mô tả cho dịch vụ này."}
            </p>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.status !== "Còn hàng"}
              className={`w-full flex items-center justify-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition ${
                product.status === "Còn hàng"
                  ? "hover:bg-orange-600"
                  : "bg-gray-400 cursor-not-allowed opacity-70"
              }`}
            >
              <ShoppingCart size={22} />
              {product.status === "Còn hàng" ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSalesDetail;

import React, { useState } from "react";
import { Trash2, Plus, Minus, Send } from "lucide-react"; // Thêm icon Send
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { repairService } from "../../services/repairService"; // ✅ Import repairService
import { formatCurrency } from "../../utils/helpers";

function OrderSidebar() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // ✅ State mới để lưu thông tin phiếu sửa chữa
  const [repairInfo, setRepairInfo] = useState({
    maXe: "",
    maTho: "",
    bienSo: "",
    tenTho: "",
    moTa: "",
  });

  // ✅ Hàm xử lý thay đổi input thông tin phiếu
  const handleInfoChange = (e) => {
    const { name, value, type } = e.target;
    setRepairInfo((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || "" : value,
    }));
  };

  // ✅ Hàm xử lý khi nhấn "Tạo đơn"
  const handleCreateRepairOrder = async () => {
    // Kiểm tra dữ liệu cơ bản
    if (cartItems.length === 0) {
      showToast("Vui lòng thêm ít nhất một dịch vụ vào đơn.", "warning");
      return;
    }
    if (!repairInfo.bienSo || !repairInfo.tenTho) {
      showToast("Vui lòng nhập Biển số xe và Tên thợ.", "warning");
      return;
    }

    // Chuẩn bị dữ liệu chi tiết dịch vụ
    const chiTietList = cartItems.map((item) => ({
      maDichVu: item.id,
      soLuong: item.qty,
    }));

    // Chuẩn bị payload cuối cùng
    const payload = {
      maXe: repairInfo.maXe || 0, // Gửi 0 nếu không nhập
      maTho: repairInfo.maTho || 0, // Gửi 0 nếu không nhập
      bienSo: repairInfo.bienSo,
      tenTho: repairInfo.tenTho,
      moTa: repairInfo.moTa || "",
      chiTietList: chiTietList,
    };

    setLoading(true);
    try {
      const response = await repairService.create(payload);
      showToast(
        response.message || "Tạo phiếu sửa chữa thành công!",
        "success"
      );
      clearCart(); // Xóa giỏ hàng
      // Reset form thông tin
      setRepairInfo({ maXe: "", maTho: "", bienSo: "", tenTho: "", moTa: "" });
    } catch (err) {
      showToast(err.message || "Tạo phiếu thất bại.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng tiền (chỉ để hiển thị, không gửi đi)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <aside className="w-96 bg-white dark:bg-gray-900 border-l dark:border-gray-700 shadow-sm p-4 flex flex-col h-screen">
      {" "}
      {/* Tăng chiều rộng */}
      <h5 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Tạo Phiếu Sửa Chữa
      </h5>
      {/* ✅ KHU VỰC NHẬP THÔNG TIN PHIẾU */}
      <div className="mb-4 border-b dark:border-gray-700 pb-4 space-y-3">
        <h6 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Thông tin xe & thợ
        </h6>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="maXe"
            value={repairInfo.maXe}
            onChange={handleInfoChange}
            placeholder="Mã xe (Nếu có)"
            className="input-style text-sm"
          />
          <input
            type="number"
            name="maTho"
            value={repairInfo.maTho}
            onChange={handleInfoChange}
            placeholder="Mã thợ (Nếu có)"
            className="input-style text-sm"
          />
        </div>
        <input
          type="text"
          name="bienSo"
          value={repairInfo.bienSo}
          onChange={handleInfoChange}
          placeholder="Biển số xe*"
          className="w-full input-style text-sm"
          required
        />
        <input
          type="text"
          name="tenTho"
          value={repairInfo.tenTho}
          onChange={handleInfoChange}
          placeholder="Tên thợ phụ trách*"
          className="w-full input-style text-sm"
          required
        />
        <textarea
          name="moTa"
          value={repairInfo.moTa}
          onChange={handleInfoChange}
          placeholder="Mô tả sửa chữa..."
          rows="2"
          className="w-full input-style text-sm"
        ></textarea>
      </div>
      {/* DANH SÁCH DỊCH VỤ ĐÃ CHỌN */}
      <h6 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        Dịch vụ đã chọn
      </h6>
      <div className="flex-1 overflow-y-auto mb-4 pr-1">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="mb-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm w-4/5">
                  {item.name}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                  title="Xóa dịch vụ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-2 py-0.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-2 text-sm font-semibold">{item.qty}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="px-2 py-0.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                  {formatCurrency(item.qty * item.price)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
            <p className="mt-2 text-sm">Chưa chọn dịch vụ nào</p>
          </div>
        )}
      </div>
      {/* TỔNG TIỀN (Chỉ hiển thị) & NÚT TẠO ĐƠN */}
      <div className="border-t dark:border-gray-700 pt-4 mt-auto space-y-3">
        <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-100 text-md">
          <span>Tổng tiền dịch vụ:</span>
          <span className="text-orange-600">{formatCurrency(total)}</span>
        </div>

        {/* ✅ Đổi nút Thanh toán thành Tạo đơn */}
        <button
          onClick={handleCreateRepairOrder}
          disabled={cartItems.length === 0 || loading} // Disable khi đang gửi hoặc giỏ rỗng
          className={`w-full flex items-center justify-center gap-2 mt-2 py-2.5 rounded-lg text-white font-semibold transition ${
            cartItems.length === 0 || loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90" // Đổi màu nút
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send size={18} />
          )}
          <span>{loading ? "Đang xử lý..." : "Tạo Đơn Sửa Chữa"}</span>
        </button>
      </div>
    </aside>
  );
}

export default OrderSidebar;

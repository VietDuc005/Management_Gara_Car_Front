import React, { useState, useEffect } from "react";
import { Edit3 } from "lucide-react";
import Loading from "./Loading";

const UpdateInvoiceModal = ({ isOpen, onClose, onSave, currentData }) => {
  // State để theo dõi trường đang được chỉnh sửa ('trangThai' hoặc 'kieuThanhToan')
  const [editField, setEditField] = useState("trangThai");
  // State cho giá trị mới của trường đã chọn
  const [selectedValue, setSelectedValue] = useState("");
const [loading] = useState(false);
  const statusOptions = ["Đã thanh toán", "Chưa thanh toán", "Đã hủy"];
  const paymentOptions = ["Thẻ", "Chuyển khoản", "Tiền mặt"];

  // Đặt giá trị mặc định khi modal mở hoặc trường chỉnh sửa thay đổi
  useEffect(() => {
    if (currentData) {
      if (editField === "trangThai") {
        setSelectedValue(currentData.trangThai || "Chưa thanh toán");
      } else {
        setSelectedValue(currentData.kieuThanhToan || "Tiền mặt");
      }
    }
  }, [currentData, editField, isOpen]);

  const handleSave = () => {
    // Truyền cả tên trường và giá trị mới về component cha
    onSave(editField, selectedValue);
  };

  if (!isOpen) return null;

  if (loading) return <Loading />;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="p-5 border-b flex items-center gap-3">
          <Edit3 className="text-orange-500" size={24} />
          <h3 className="text-lg font-bold text-gray-800">
            Cập nhật Hóa đơn #{currentData?.maHoaDon}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Dropdown 1: Chọn trường muốn sửa */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Trường cần sửa
            </label>
            <select
              value={editField}
              onChange={(e) => setEditField(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
            >
              <option value="trangThai">Trạng thái</option>
              <option value="kieuThanhToan">Kiểu thanh toán</option>
            </select>
          </div>

          {/* Dropdown 2: Chọn giá trị mới */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Giá trị mới
            </label>
            <select
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
            >
              {(editField === "trangThai" ? statusOptions : paymentOptions).map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Hiển thị giá trị hiện tại */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Giá trị hiện tại:</p>
            <p className="text-sm font-semibold text-gray-800">
              {editField === "trangThai"
                ? currentData?.trangThai
                : currentData?.kieuThanhToan}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoiceModal;

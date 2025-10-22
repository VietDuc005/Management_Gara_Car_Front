import React from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * Modal xác nhận hành động
 * @param {object} props
 * @param {boolean} props.isOpen - Trạng thái mở/đóng của modal
 * @param {function} props.onClose - Hàm để đóng modal
 * @param {function} props.onConfirm - Hàm để thực thi khi xác nhận
 * @param {string} props.title - Tiêu đề của modal
 * @param {string} props.message - Thông điệp xác nhận
 */
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[450px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="text-red-600" size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

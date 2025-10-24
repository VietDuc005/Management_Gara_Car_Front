import React from "react";
import {
  X,
  FileText,
  Calendar,
  Tag,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { formatDateTime, formatCurrency } from "../../utils/helpers"; // Dùng formatDateTime để hiển thị cả giờ

const InvoiceDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Chưa thanh toán":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Chi tiết Hóa đơn #{data.maHoaDon}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
            <InfoItem
              icon={<Tag size={16} />}
              label="Mã Phiếu Sửa"
              value={`#${data.maPhieu}`}
            />
            <InfoItem
              icon={<Calendar size={16} />}
              label="Ngày Lập Hóa Đơn"
              value={formatDateTime(data.ngayLapHoaDon)}
            />
            <InfoItem
              icon={<Calendar size={16} />}
              label="Thời Gian Thanh Toán"
              value={formatDateTime(data.thoiGianThanhCong)}
            />
            <InfoItem
              icon={<CreditCard size={16} />}
              label="Kiểu Thanh Toán"
              value={data.kieuThanhToan}
            />
            <InfoItem
              icon={<Tag size={16} />}
              label="Trạng Thái"
              value={
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusChipColor(
                    data.trangThai
                  )}`}
                >
                  {data.trangThai}
                </span>
              }
            />
            <InfoItem
              icon={<DollarSign size={16} />}
              label="Tổng tiền"
              value={formatCurrency(data.tongTien)}
              isBold={true}
            />
          </div>

          <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">
            Chi tiết dịch vụ thanh toán:
          </h4>
          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                    Tên Dịch Vụ
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-600 dark:text-gray-300">
                    Số Lượng
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300">
                    Đơn Giá
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300">
                    Thành Tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {data.chiTietList.map((item, index) => (
                  <tr key={index} className="dark:text-gray-300">
                    <td className="p-3 font-medium text-gray-800 dark:text-gray-100">
                      {item.tenDichVu}
                    </td>
                    <td className="p-3 text-center">{item.soLuong}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.donGia)}
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-800 dark:text-gray-100">
                      {formatCurrency(item.thanhTien)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component
const InfoItem = ({ icon, label, value, isBold = false }) => (
  <div className="flex items-start gap-3">
    <span className="text-gray-500 dark:text-gray-400 mt-0.5">{icon}</span>
    <div>
      <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p
        className={`text-gray-800 dark:text-gray-100 ${
          isBold ? "font-bold text-base" : "font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default InvoiceDetailsModal;

import React,{useState} from "react";
import {
  X,
  FileText,
  Wrench,
  Calendar,
  Tag,
  DollarSign,
  Car,
} from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/helpers";
import Loading from "./Loading";

/**
 * Modal hiển thị chi tiết một Phiếu sửa chữa (hỗ trợ Dark Mode)
 * @param {object} props
 * @param {boolean} props.isOpen - Trạng thái mở/đóng
 * @param {function} props.onClose - Hàm để đóng modal
 * @param {object} props.data - Dữ liệu của phiếu sửa chữa
 */
const RepairDetailsModal = ({ isOpen, onClose, data }) => {
  const[loading] = useState(false);
  if (!isOpen || !data) return null;

  // Cập nhật màu sắc chip trạng thái cho Dark Mode
  const getStatusChipColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Đã giao":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Đang sửa":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in transition-colors duration-300">
      {/* Thêm dark mode cho nền modal và shadow */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="text-orange-500" size={24} />
            {/* Thêm dark mode cho tiêu đề */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Chi tiết Phiếu Sửa Chữa #{data.maPhieu}
            </h3>
          </div>
          {/* Thêm dark mode cho nút đóng */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* Thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-sm">
            <InfoItem
              icon={<Car size={16} />}
              label="Biển số xe"
              value={data.bienSo}
            />
            <InfoItem
              icon={<Wrench size={16} />}
              label="Thợ phụ trách"
              value={data.tenTho}
            />
            <InfoItem
              icon={<Calendar size={16} />}
              label="Ngày lập phiếu"
              value={formatDate(data.ngayLap)}
            />
            <InfoItem
              icon={<Tag size={16} />}
              label="Trạng thái"
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
          {/* Thêm dark mode cho phần mô tả */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              Mô tả:
            </span>{" "}
            {data.moTa}
          </p>

          {/* Chi tiết dịch vụ */}
          <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">
            Các dịch vụ đã thực hiện:
          </h4>
          {/* Thêm dark mode cho bảng chi tiết */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
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
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
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
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end transition-colors duration-300">
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

// Helper component - Thêm dark mode
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

export default RepairDetailsModal;

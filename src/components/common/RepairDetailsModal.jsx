import React from "react";
import {
  X,
  FileText,
  Wrench,
  User,
  Calendar,
  Tag,
  DollarSign,
  Car,
} from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/helpers";

/**
 * Modal hiển thị chi tiết một Phiếu sửa chữa
 * @param {object} props
 * @param {boolean} props.isOpen - Trạng thái mở/đóng
 * @param {function} props.onClose - Hàm để đóng modal
 * @param {object} props.data - Dữ liệu của phiếu sửa chữa
 */
const RepairDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang tiến hành":
        return "bg-blue-100 text-blue-800";
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div className="flex items-center gap-3">
            <FileText className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              Chi tiết Phiếu Sửa Chữa #{data.maPhieu}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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
          <p className="text-sm text-gray-700 mb-6 bg-gray-50 p-3 rounded-lg border">
            <span className="font-semibold">Mô tả:</span> {data.moTa}
          </p>

          {/* Chi tiết dịch vụ */}
          <h4 className="font-bold text-gray-700 mb-3">
            Các dịch vụ đã thực hiện:
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-semibold text-gray-600">
                    Tên Dịch Vụ
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-600">
                    Số Lượng
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    Đơn Giá
                  </th>
                  <th className="p-3 text-right font-semibold text-gray-600">
                    Thành Tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.chiTietList.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 font-medium">{item.tenDichVu}</td>
                    <td className="p-3 text-center">{item.soLuong}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.donGia)}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatCurrency(item.thanhTien)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-end">
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
    <span className="text-gray-500 mt-0.5">{icon}</span>
    <div>
      <p className="text-gray-500 font-medium">{label}</p>
      <p
        className={`text-gray-800 ${
          isBold ? "font-bold text-base" : "font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default RepairDetailsModal;

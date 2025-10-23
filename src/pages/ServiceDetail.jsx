import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { formatCurrency, formatDateTime } from "../utils/helpers";
import { API_BASE_URL } from "../utils/constants";
import { ArrowLeft, X } from "lucide-react";

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { showToast } = useToast();

  const service = state?.serviceData;

  useEffect(() => {
    if (!service) {
      showToast("Không có dữ liệu, đang chuyển hướng...", "warning");
      navigate("/services");
    }
  }, [service, navigate, showToast]);

  // Component con không thay đổi
  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}:
      </p>
      <p className="text-base font-semibold text-gray-800 dark:text-gray-100 text-right">
        {value || "N/A"}
      </p>
    </div>
  );

  // Nếu không có service, return null để chờ chuyển hướng
  if (!service) {
    return null;
  }

  // ✅ BỌC TOÀN BỘ GIAO DIỆN TRONG CẤU TRÚC MODAL
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header của Modal */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold text-orange-500">
            Chi tiết Dịch vụ: {service.tenDichVu}
          </h3>
          <button
            onClick={() => navigate("/services")}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Đóng"
          >
            <X />
          </button>
        </div>

        {/* Nội dung chi tiết (có thể cuộn) */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CỘT TRÁI: THÔNG TIN */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700">
              <h3 className="font-bold text-lg text-orange-500 mb-2 border-b dark:border-gray-700 pb-2">
                Thông tin chi tiết
              </h3>
              <div className="space-y-1">
                <DetailItem label="Mã Dịch Vụ" value={service.maDichVu} />
                <DetailItem label="Tên Dịch Vụ" value={service.tenDichVu} />
                <DetailItem
                  label="Loại Dịch Vụ"
                  value={service.tenLoaiDichVu}
                />
                <DetailItem label="Giá" value={formatCurrency(service.gia)} />
                <DetailItem label="Trạng Thái" value={service.trangThai} />
                <DetailItem label="Số Lượng Tồn" value={service.soLuongTon} />
                <DetailItem
                  label="Số Lượng Đã Bán"
                  value={service.soLuongBan}
                />
                <DetailItem
                  label="Thời gian ước tính (giờ)"
                  value={service.thoiGianUocTinh}
                />
                <DetailItem
                  label="Ngày Tạo"
                  value={formatDateTime(service.ngayTao)}
                />
              </div>
            </div>

            {/* CỘT PHẢI: HÌNH ẢNH & MÔ TẢ */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700">
                <h3 className="font-bold text-lg text-orange-500 mb-4">
                  Hình ảnh
                </h3>
                {service.anhDichVuUrl ? (
                  <div className="flex justify-center items-center">
                    <img
                      src={`${API_BASE_URL}${service.anhDichVuUrl}`}
                      alt={service.tenDichVu}
                      className="max-h-60 w-auto object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Không có hình ảnh.</p>
                )}
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-700">
                <h3 className="font-bold text-lg text-orange-500 mb-2">
                  Mô tả
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-sm">
                  {service.moTa || "Không có mô tả chi tiết."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer của Modal */}
        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700 mt-auto">
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            <ArrowLeft size={18} /> Quay lại Danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

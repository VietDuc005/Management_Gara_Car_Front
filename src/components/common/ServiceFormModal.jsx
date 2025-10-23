import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { UploadCloud, X } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const ServiceFormModal = ({
  isOpen,
  onClose,
  onSave,
  mode = "create",
  initialData = null,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData({
          tenDichVu: initialData.tenDichVu || "",
          moTa: initialData.moTa || "",
          soLuongTon: initialData.soLuongTon || 0,
          soLuongBan: initialData.soLuongBan || 0,
          gia: initialData.gia || 0,
          thoiGianUocTinh: initialData.thoiGianUocTinh || 1,
          trangThai: initialData.trangThai || "Còn hàng",
          tenLoaiDichVu: initialData.tenLoaiDichVu || "",
        });
        if (initialData.anhDichVuUrl) {
          setImagePreview(`${API_BASE_URL}${initialData.anhDichVuUrl}`);
        }
      } else {
        // Chế độ thêm mới: Chỉ khởi tạo các trường cần thiết
        setFormData({
          tenDichVu: "",
          moTa: "",
          soLuongTon: 0,
          soLuongBan: 0, // Vẫn giữ để form không lỗi, nhưng sẽ không gửi đi
          gia: 0,
          thoiGianUocTinh: 1,
          tenLoaiDichVu: "",
        });
      }
      setImageFile(null);
      if (!initialData?.anhDichVuUrl) {
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      const numValue = value === "" ? "" : Math.max(0, parseInt(value, 10));
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview(
        initialData?.anhDichVuUrl
          ? `${API_BASE_URL}${initialData.anhDichVuUrl}`
          : null
      );
    }
  };

  // ✅ SỬA LẠI HÀM NÀY ĐỂ GỬI ĐÚNG DỮ LIỆU
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenDichVu || !formData.tenLoaiDichVu || formData.gia <= 0) {
      showToast("Vui lòng điền các trường bắt buộc.", "warning");
      return;
    }

    const dataToSend = new FormData();

    if (mode === "edit") {
      // Khi CẬP NHẬT, gửi tất cả các trường trong form
      Object.keys(formData).forEach((key) => {
        const value = formData[key] === "" ? 0 : formData[key];
        dataToSend.append(key, value);
      });
    } else {
      // Khi THÊM MỚI, chỉ gửi các trường cần thiết
      dataToSend.append("tenDichVu", formData.tenDichVu);
      dataToSend.append("moTa", formData.moTa || "");
      dataToSend.append(
        "soLuongTon",
        formData.soLuongTon === "" ? 0 : formData.soLuongTon
      );
      dataToSend.append("soLuongBan", 0); // Gửi giá trị mặc định theo yêu cầu API
      dataToSend.append("gia", formData.gia === "" ? 0 : formData.gia);
      dataToSend.append(
        "thoiGianUocTinh",
        formData.thoiGianUocTinh === "" ? 1 : formData.thoiGianUocTinh
      );
      dataToSend.append("tenLoaiDichVu", formData.tenLoaiDichVu);
      // Cố tình bỏ qua trường 'trangThai' khi thêm mới
    }

    if (imageFile) {
      dataToSend.append("imageFile", imageFile);
    }
    onSave(dataToSend);
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold text-orange-500">
            {mode === "edit" ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Tên Dịch Vụ*
            </label>
            <input
              name="tenDichVu"
              value={formData.tenDichVu}
              onChange={handleChange}
              className="w-full input-style"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Loại Dịch Vụ*
            </label>
            <input
              name="tenLoaiDichVu"
              value={formData.tenLoaiDichVu}
              onChange={handleChange}
              className="w-full input-style"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Giá (VND)*</label>
            <input
              name="gia"
              type="number"
              min="0"
              value={formData.gia}
              onChange={handleChange}
              className="w-full input-style"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Số Lượng Tồn
            </label>
            <input
              name="soLuongTon"
              type="number"
              min="0"
              value={formData.soLuongTon}
              onChange={handleChange}
              className="w-full input-style"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Thời gian (giờ)
            </label>
            <input
              name="thoiGianUocTinh"
              type="number"
              min="0"
              value={formData.thoiGianUocTinh}
              onChange={handleChange}
              className="w-full input-style"
            />
          </div>

          {mode === "edit" && (
            <div>
              <label className="block mb-1 text-sm font-medium">
                Trạng Thái*
              </label>
              <select
                name="trangThai"
                value={formData.trangThai}
                onChange={handleChange}
                className="w-full input-style"
              >
                <option value="Còn hàng">Còn hàng</option>
                <option value="Hết hàng">Hết hàng</option>
                <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Hình ảnh</label>
            <div className="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="mx-auto h-24 w-auto rounded-md object-cover"
                  />
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-orange-600 hover:text-orange-500"
                  >
                    <span>{imagePreview ? "Thay đổi ảnh" : "Tải ảnh lên"}</span>
                    <input
                      id="file-upload"
                      name="imageFile"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Mô Tả</label>
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              rows="2"
              className="w-full input-style"
            ></textarea>
          </div>
        </form>

        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModal;

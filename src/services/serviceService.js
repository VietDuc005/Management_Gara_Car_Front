import { apiCall } from "./api";

/**
 * Service quản lý Dịch vụ
 * Đường dẫn gốc: /api/dichvu
 */
export const serviceService = {
  /**
   * Lấy danh sách dịch vụ có phân trang và sắp xếp
   * @param {number} page - Số trang (bắt đầu từ 0)
   * @param {number} size - Kích thước trang
   * @param {string} sortBy - Tên trường sắp xếp
   * @param {string} sortDirection - 'asc' hoặc 'desc'
   * @returns {Promise<object>}
   */
  async getAll(
    page = 0,
    size = 10,
    sortBy = "ngayTao",
    sortDirection = "desc"
  ) {
    const params = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDirection,
    });
    return await apiCall(`/api/dichvu/hienThiDanhSach?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Tìm kiếm dịch vụ theo tên hoặc loại dịch vụ
   * @param {object} searchCriteria - { tenDichVu: string, loaiDichVu: string }
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @param {string} sortBy - Tên trường sắp xếp
   * @param {string} sortDirection - 'asc' hoặc 'desc'
   * @returns {Promise<object>}
   */
  async search(
    searchCriteria = {},
    page = 0,
    size = 10,
    sortBy = "ngayTao",
    sortDirection = "desc"
  ) {
    const params = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDirection,
    });

    if (searchCriteria.tenDichVu) {
      params.append("tenDichVu", searchCriteria.tenDichVu);
    }
    if (searchCriteria.loaiDichVu) {
      params.append("loaiDichVu", searchCriteria.loaiDichVu);
    }

    return await apiCall(`/api/dichvu/timKiem?${params.toString()}`, {
      method: "GET",
    });
  },

  // --- Các hàm CRUD khác (sẽ triển khai sau) ---

  /**
   * Thêm mới một dịch vụ
   * @param {object} data - Dữ liệu dịch vụ mới (FormData)
   */
  async create(formData) {
    // Khi upload file, không set Content-Type, browser sẽ tự làm
    return await apiCall("/api/dichvu/them", {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Cập nhật một dịch vụ
   * @param {number|string} id - Mã dịch vụ cần cập nhật
   * @param {FormData} formData - Dữ liệu cập nhật (bao gồm cả file ảnh nếu có)
   */
  async update(id, formData) {
    return await apiCall(`/api/dichvu/${id}`, {
      method: "PUT",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // Quan trọng khi có file
      },
    });
  },

  /**
   * Xóa một dịch vụ
   * @param {number|string} id - Mã dịch vụ
   */
  async delete(id) {
    return await apiCall(`/api/dichvu/${id}`, {
      method: "DELETE",
    });
  },
};

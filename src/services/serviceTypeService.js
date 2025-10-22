import { apiCall } from "./api";

/**
 * Service quản lý Loại Dịch vụ
 * Đường dẫn gốc: /api/loaidichvu
 */
export const serviceTypeService = {
  /**
   * Lấy danh sách loại dịch vụ có phân trang và sắp xếp
   * @param {number} page - Số trang bắt đầu từ 0
   * @param {number} size - Kích thước trang
   * @param {string} sortBy - Tên trường để sắp xếp
   * @param {string} sortDirection - 'asc' hoặc 'desc'
   * @returns {Promise<object>} - Trả về object chứa content, totalPages, etc.
   */
  async getAll(
    page = 0,
    size = 10,
    sortBy = "ngayTao",
    sortDirection = "desc"
  ) {
    const response = await apiCall(
      `/api/loaidichvu/hienThiDanhSach?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      { method: "GET" }
    );

    // ✅ SỬA LẠI CHO ĐÚNG
    // Giả định `apiCall` trả về thẳng object JSON từ server.
    // Chúng ta trả về `response` trực tiếp.
    return response;
  },

  /**
   * Tìm kiếm loại dịch vụ theo tên hoặc trạng thái
   * @param {object} searchCriteria - { tenLoai: string, trangThai: string }
   * @param {number} page - Số trang
   * @param {number} size - Kích thước trang
   * @returns {Promise<object>}
   */
  async search(searchCriteria = {}, page = 0, size = 10) {
    // Xây dựng các query parameters
    const params = new URLSearchParams({
      page: page,
      size: size,
    });

    // Chỉ thêm các tham số tìm kiếm nếu chúng có giá trị
    if (searchCriteria.tenLoai) {
      params.append("tenLoai", searchCriteria.tenLoai);
    }
    if (searchCriteria.trangThai) {
      params.append("trangThai", searchCriteria.trangThai);
    }

    const response = await apiCall(
      `/api/loaidichvu/timKiem?${params.toString()}`,
      { method: "GET" }
    );

    return response;
  },

  /**
   * Thêm mới một loại dịch vụ
   * @param {object} data - Dữ liệu cần thêm, ví dụ: { tenLoai: "Tên mới" }
   * @returns {Promise<object>}
   */
  async create(data) {
    return await apiCall("/api/loaidichvu/them", {
      method: "POST",
      data: data, // axios sẽ tự động chuyển thành JSON
    });
  },

  /**
   * Cập nhật một loại dịch vụ
   * @param {number|string} id - Mã loại dịch vụ cần cập nhật
   * @param {object} data - Dữ liệu cập nhật, ví dụ: { tenLoai: "Tên mới" }
   */
  async update(id, data) {
    return await apiCall(`/api/loaidichvu/${id}`, {
      method: "PUT",
      data: data,
    });
  },

  /**
   * Xóa một loại dịch vụ (thường là xóa mềm)
   * @param {number|string} id - Mã loại dịch vụ cần xóa
   */
  async delete(id) {
    return await apiCall(`/api/loaidichvu/${id}`, {
      method: "DELETE",
    });
  },
};

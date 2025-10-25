import { apiCall } from "./api";

/**
 * Service quản lý Thợ
 * Đường dẫn gốc: /api/tho
 */
export const machineService = {
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
    sortBy = "ngayVaoLam",
    sortDirection = "desc"
  ) {
    const response = await apiCall(
      `/api/tho/hienThiDanhSach?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      { method: "GET" }
    );

    return response;
  },

  /**
   * Tìm kiếm thợ theo tên hoặc trạng thái
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
    if (searchCriteria.tenTho) {
      params.append("tenTho", searchCriteria.tenTho);
    }
    if (searchCriteria.trangThai) {
      params.append("trangThai", searchCriteria.trangThai);
    }
    if (searchCriteria.kinhNghiem) {
      params.append("kinhNghiem", searchCriteria.kinhNghiem);
    }
    if (searchCriteria.chuyenMon) {
      params.append("chuyenMon", searchCriteria.chuyenMon);
    }
    const response = await apiCall(
      `/api/tho/timKiem?${params.toString()}`,
      {
        method: "GET",
      }
    );

    return response;
  },

  /**
   * Thêm mới một thợ
   * @param {object} data - Dữ liệu cần thêm, ví dụ: { tenLoai: "Tên mới" }
   * @returns {Promise<object>}
   */
  async create(data) {
    return await apiCall("/api/tho/them", {
      method: "POST",
      data: data, // axios sẽ tự động chuyển thành JSON
    });
  },

  /**
   * Cập nhật một thợ
   * @param {number|string} id - Mã thợ cần cập nhật
   * @param {object} data - Dữ liệu cập nhật, ví dụ: { tenLoai: "Tên mới" }
   */
  async update(id, data) {
    return await apiCall(`/api/tho/${id}`, {
      method: "PUT",
      data: data,
    });
  },

  /**
   * Xóa một thợ(thường là xóa mềm)
   * @param {number|string} id - Mã thợ cần xóa
   */
  async delete(id) {
    return await apiCall(`/api/tho/${id}`, {
      method: "DELETE",
    });
  },
};

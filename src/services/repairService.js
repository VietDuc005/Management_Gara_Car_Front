import { apiCall } from "./api";

/**
 * Service để quản lý Phiếu sửa chữa
 * API endpoint: /api/phieusuachua
 */
export const repairService = {
  /**
   * Lấy danh sách phiếu sửa chữa
   */
  async getAll(
    page = 0,
    size = 10,
    sortBy = "ngayLap",
    sortDirection = "desc"
  ) {
    const endpoint = `/api/phieusuachua/HienThiDanhSach?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
    return await apiCall(endpoint, { method: "GET" });
  },

  /**
   * Tìm kiếm phiếu sửa chữa theo nhiều tiêu chí
   */
  async search(
    criteria = {},
    page = 0,
    size = 10,
    sortBy = "ngayLap",
    sortDirection = "desc"
  ) {
    const params = new URLSearchParams({ page, size, sortBy, sortDirection });
    if (criteria.bienSo) {
      params.append("bienSo", criteria.bienSo);
    }
    if (criteria.trangThai) {
      params.append("trangThai", criteria.trangThai);
    }

    return await apiCall(`/api/phieusuachua/timKiem?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Cập nhật trạng thái của một phiếu sửa chữa
   * @param {number|string} id - Mã phiếu sửa chữa
   * @param {string} newStatus - Trạng thái mới
   */
  async updateStatus(id, newStatus) {
    // Mã hóa (encode) trạng thái để xử lý ký tự tiếng Việt trong URL
    const encodedStatus = encodeURIComponent(newStatus);
    return await apiCall(
      `/api/phieusuachua/${id}/capNhatTrangThai?trangThai=${encodedStatus}`,
      {
        method: "PATCH", // Hoặc 'POST' tùy vào backend, 'PUT' thường dùng cho cập nhật
      }
    );
  },

  /**
   * Tạo mới một phiếu sửa chữa
   * @param {object} data - Dữ liệu phiếu sửa chữa theo cấu trúc yêu cầu
   * @returns {Promise<object>}
   */
  async create(data) {
    return await apiCall("/api/phieusuachua/them", {
      method: "POST",
      data: data, // Gửi dưới dạng JSON
      headers: { "Content-Type": "application/json" },
    });
  },
};

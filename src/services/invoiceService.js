import { apiCall } from "./api";

/**
 * Service quản lý Hóa đơn
 * Đường dẫn gốc: /api/hoadon
 */
export const invoiceService = {
  /**
   * Lấy danh sách hóa đơn có phân trang và sắp xếp
   */
  async getAll(
    page = 0,
    size = 10,
    sortBy = "ngayLapHoaDon",
    sortDirection = "desc"
  ) {
    const params = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDirection,
    });
    return await apiCall(`/api/hoadon/hienThiDanhSach?${params.toString()}`);
  },

  /**
   * Tìm kiếm hóa đơn theo nhiều tiêu chí
   * @param {object} criteria - { maPhieu, tongTienMin, tongTienMax, trangThai }
   */
  async search(
    criteria = {},
    page = 0,
    size = 10,
    sortBy = "ngayLapHoaDon",
    sortDirection = "desc"
  ) {
    const params = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDirection,
    });

    // Chỉ thêm các tham số tìm kiếm nếu chúng có giá trị
    if (criteria.trangThai) params.append("trangThai", criteria.trangThai);

    return await apiCall(`/api/hoadon/timKiem?${params.toString()}`);
  },

  /**
   * Updates the status of a specific invoice.
   * @param {number|string} maHoaDon - The ID of the invoice.
   * @param {string} trangThai - The new status.
   * @returns {Promise<object>}
   */
  async updateStatus(maHoaDon, trangThai) {
    return await apiCall(`/api/hoadon/${maHoaDon}/trangThai`, {
      method: "PATCH",
      // The status is sent as a JSON object in the body
      data: { trangThai },
      headers: { "Content-Type": "application/json" },
    });
  },

  /**
   * Updates the payment method of a specific invoice.
   * @param {number|string} maHoaDon - The ID of the invoice.
   * @param {string} kieuThanhToan - The new payment method.
   * @returns {Promise<object>}
   */
  async updatePaymentMethod(maHoaDon, kieuThanhToan) {
    return await apiCall(`/api/hoadon/${maHoaDon}/kieuThanhToan`, {
      method: "PATCH",
      // The payment method is sent as a JSON object in the body
      data: { kieuThanhToan },
      headers: { "Content-Type": "application/json" },
    });
  },
};

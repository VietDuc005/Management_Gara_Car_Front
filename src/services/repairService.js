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
};

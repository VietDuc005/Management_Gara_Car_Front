import { apiCall } from "./api";

/**
 * Service quản lý Tài khoản
 * Đường dẫn gốc: /api/auth
 */
export const authService = {
  /**
   * 📌 Đăng nhập
   */
  async login(username, password) {
    return await apiCall("/api/auth/dangNhap", {
      method: "POST",
      data: { tenDangNhap: username, matKhau: password },
    });
  },

  /**
   * 📌 Đăng ký tài khoản mới
   */
  async register(data) {
    return await apiCall("/api/auth/dangKy", {
      method: "POST",
      data,
    });
  },

  /**
   * 📌 Đổi mật khẩu (chỉ đổi cho chính mình)
   */
  async changePassword(data) {
    return await apiCall("/api/auth/doiMatKhau", {
      method: "PUT",
      data,
    });
  },

  /**
   * 📌 Lấy danh sách tài khoản có phân trang
   */
  async getAll(page = 0, size = 10, sortBy = "ngayTao", sortDirection = "desc") {
    return await apiCall(
      `/api/auth/hienThiDanhSach?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      { method: "GET" }
    );
  },

  /**
   * 📌 Tìm kiếm tài khoản theo các tiêu chí
   * @param Object {tenDangNhap, email, vaiTro, trangThai}
   */
  async search(searchCriteria = {}, page = 0, size = 10) {
    const params = new URLSearchParams({ page, size });

    Object.keys(searchCriteria).forEach((key) => {
      if (searchCriteria[key]) {
        params.append(key, searchCriteria[key]);
      }
    });

    return await apiCall(`/api/auth/timKiem?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * 📌 Thống kê tài khoản
   */
  async getStatistics() {
    return await apiCall("/api/auth/thongKeTaiKhoan", {
      method: "GET",
    });
  },

  /**
   * 📌 Cập nhật tài khoản
   */
  async update(id, data) {
    return await apiCall(`/api/auth/capNhat/${id}`, {
      method: "PUT",
      data,
    });
  },
};

import { apiCall } from "./api";

/**
 * Service quản lý Tài khoản
 * Đường dẫn gốc: /api/auth
 */
export const authService = {
  /**
   * 📌 Đăng nhập hệ thống
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
   * 📌 Đổi mật khẩu
   */
  /**
 * 📌 Đổi mật khẩu
 */
async changePassword(data) {
  return await apiCall("/api/auth/doiMatKhau", {
    method: "PUT",
    data: {
      tenDangNhap: data.tenDangNhap, // ✅ backend yêu cầu
      matKhauCu: data.matKhauCu,
      matKhauMoi: data.matKhauMoi,
    },
  });
},


  /**
   * 📌 Lấy danh sách tài khoản có phân trang
   */
  async getAll(
    page = 0,
    size = 10,
    sortBy = "ngayTao",
    sortDirection = "desc"
  ) {
    const response = await apiCall(
      `/api/auth/hienThiDanhSach?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      { method: "GET" }
    );
    return response;
  },

  /**
   * 📌 Tìm kiếm tài khoản
   * @param searchCriteria {tenDangNhap, email, vaiTro, trangThai}
   */
  async search(searchCriteria = {}, page = 0, size = 10) {
    const params = new URLSearchParams({
      page,
      size,
    });

    if (searchCriteria.tenDangNhap) {
      params.append("tenDangNhap", searchCriteria.tenDangNhap);
    }
    if (searchCriteria.email) {
      params.append("email", searchCriteria.email);
    }
    if (searchCriteria.vaiTro) {
      params.append("vaiTro", searchCriteria.vaiTro);
    }
    if (searchCriteria.trangThai) {
      params.append("trangThai", searchCriteria.trangThai);
    }

    return await apiCall(`/api/auth/timKiem?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * 📌 Thống kê tài khoản: tổng số, hoạt động, nhân viên
   */
  async getStatistics() {
    return await apiCall("/api/auth/thongKeTaiKhoan", {
      method: "GET",
    });
  },

  /**
   * 📌 Cập nhật thông tin tài khoản
   */
  async update(id, data) {
    return await apiCall(`/api/auth/capNhat/${id}`, {
      method: "PUT",
      data,
    });
  },
};

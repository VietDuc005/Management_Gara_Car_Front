import { apiCall } from "./api";

/**
 * Service thống kê (Thống kê hệ thống, tỷ lệ sử dụng, doanh thu...)
 * Base endpoint: /api/thongke
 */
export const statisticService = {
  /** Lấy tổng quan hệ thống */
  async getOverview() {
    return await apiCall(`/api/thongke/hienThiThongKe`, { method: "GET" });
  },

  /** Lấy tỷ lệ sử dụng dịch vụ */
  async getTilesudung() {
    return await apiCall(`/api/thongke/ti-le-su-dung-dich-vu`, {
      method: "GET",
    });
  },

  /** Báo cáo doanh thu theo tuần (truyền vào ngày bất kỳ trong tuần đó) */
  async getDoanhthutuan(ngay) {
    return await apiCall(`/api/thongke/bao-cao-doanh-thu-tuan?ngay=${ngay}`, {
      method: "GET",
    });
  },

  /** Báo cáo doanh thu theo tháng */
  async getDoanhthuthang(thang, nam) {
    return await apiCall(
      `/api/thongke/bao-cao-doanh-thu-thang?thang=${thang}&nam=${nam}`,
      { method: "GET" }
    );
  },

  /** Báo cáo doanh thu theo năm */
  async getDoanhthunam(nam) {
    return await apiCall(`/api/thongke/bao-cao-doanh-thu-nam?nam=${nam}`, {
      method: "GET",
    });
  },

  async getTopDichVu() {
    return await apiCall(`/api/thongke/top-5-dich-vu`, { method: "GET" });
  },
  async getThongKeHoaDon() {
    return await apiCall(`/api/thongke/hoa-don`, { method: "GET" });
    //dùng cho phiếu sửa chữa
  },
  async getThongKePhieu() {
    return await apiCall(`/api/thongke/phieu-sua-chua`, { method: "GET" });
  },
};

export const API_BASE_URL = "http://localhost:8082"; // ⚙️ Đúng cổng backend Spring Boot

export const REPAIR_STATUS = {
  PENDING: "Chờ xử lý",
  IN_PROGRESS: "Đang sửa",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Hủy",
};

// Các hằng số khác (nếu cần)
export const TOKEN_KEY = "token";
export const USER_KEY = "user";

// Timeout cho API request (milliseconds)
export const API_TIMEOUT = 30000; // 30 giây

// Vai trò người dùng
export const USER_ROLES = {
  MANAGER: "Quản lý",
  EMPLOYEE: "Nhân viên",
};

// Trạng thái tài khoản
export const ACCOUNT_STATUS = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Đã xóa",
};

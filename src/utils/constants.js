export const API_BASE_URL = "http://localhost:8082"; // ⚙️ Đúng cổng backend Spring Boot


export const USER_ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  MECHANIC: 'MECHANIC',
};

export const REPAIR_STATUS = {
  PENDING: 'Chờ xử lý',
  IN_PROGRESS: 'Đang sửa',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Hủy',
};

export const PAYMENT_STATUS = {
  PAID: 'Đã thanh toán',
  UNPAID: 'Chưa thanh toán',
  PARTIAL: 'Thanh toán một phần',
};
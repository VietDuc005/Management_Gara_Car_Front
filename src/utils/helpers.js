export const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const getStatusColor = (status) => {
  const colors = {
    "Hoàn thành": "bg-green-100 text-green-800",
    "Đang sửa": "bg-blue-100 text-blue-800",
    "Chờ xử lý": "bg-yellow-100 text-yellow-800",
    "Đã thanh toán": "bg-green-100 text-green-800",
    "Chưa thanh toán": "bg-red-100 text-red-800",
    VIP: "bg-yellow-100 text-yellow-800",
    Thường: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const formatDate = (dateString) => {
  if (!dateString) return "—";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

/**
 * Định dạng chuỗi ISO date thành 'dd/MM/yyyy HH:mm:ss'
 * @param {string} isoString - Chuỗi ngày tháng theo định dạng ISO
 * @returns {string} - Chuỗi đã định dạng hoặc chuỗi rỗng
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Invalid date string:", isoString);
    return "";
  }
};

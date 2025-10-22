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

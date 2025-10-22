import { API_BASE_URL } from "../utils/constants";

const getAuthToken = () => localStorage.getItem("authToken");

export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { ...options, headers };

  if (config.data) {
    config.body = JSON.stringify(config.data);
    console.log("Sending API Request Body:", config.body);
    delete config.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // ✅ NÂNG CẤP LOGIC XỬ LÝ LỖI
    if (!response.ok) {
      // Đọc response lỗi dưới dạng văn bản thuần túy.
      const errorText = await response.text();

      // Nếu server có trả về thông điệp lỗi, sử dụng nó.
      // Nếu không, tạo một thông báo thất bại chung và thân thiện hơn.
      const finalErrorMessage = errorText
        ? errorText
        : `Thao tác thất bại: Lỗi ${response.status}. Vui lòng thử lại.`;

      // Ném lỗi với nội dung đã được xử lý
      throw new Error(finalErrorMessage);
    }

    // Xử lý trường hợp response thành công nhưng không có body (vd: 204 No Content)
    const text = await response.text();
    if (!text) {
      return { message: "Thao tác thành công!" };
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

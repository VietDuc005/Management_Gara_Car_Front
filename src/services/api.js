import axios from "axios";
import { API_BASE_URL } from "../utils/constants"; // Đảm bảo bạn có file này và export API_BASE_URL

const getAuthToken = () => localStorage.getItem("authToken");

// 1. Tạo một instance của Axios với cấu hình cơ bản
const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // URL gốc của API
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Sử dụng Interceptor để tự động đính kèm Token vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Ghi log cấu hình request (bao gồm cả data) nếu cần debug
    console.log("Sending Axios Request:", config);
    return config;
  },
  (error) => {
    // Xử lý lỗi request (hiếm khi xảy ra ở đây)
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// 3. Sử dụng Interceptor để xử lý lỗi response tập trung
axiosInstance.interceptors.response.use(
  (response) => {
    // Axios tự động trả về dữ liệu trong response.data
    // Nếu response thành công nhưng không có body (vd: DELETE thành công trả về 204)
    // thì response.data thường là chuỗi rỗng ''. Trả về thông điệp thành công mặc định.
    if (response.status === 204 || response.data === "") {
      return { message: "Thao tác thành công!" };
    }
    // Đối với các response thành công khác, trả về thẳng data
    return response.data;
  },
  (error) => {
    console.error("Axios Response Error:", error.response || error.message);

    // Xử lý lỗi 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      // Ném lỗi để dừng xử lý tiếp theo trong component
      return Promise.reject(
        new Error(
          "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại."
        )
      );
    }

    // Xử lý các lỗi khác (403, 404, 409, 500...)
    // Cố gắng lấy thông báo lỗi từ response.data (server trả về JSON lỗi hoặc text lỗi)
    // Hoặc dùng thông báo lỗi mặc định của Axios nếu không có response
    const errorMessage =
      error.response?.data?.message || // Thường là JSON { message: "..." }
      (typeof error.response?.data === "string" ? error.response.data : null) || // Server trả về text lỗi
      error.message || // Lỗi mạng hoặc lỗi request config
      "Có lỗi xảy ra. Vui lòng thử lại."; // Fallback cuối cùng

    // Ném lỗi với thông điệp đã xử lý
    return Promise.reject(new Error(errorMessage));
  }
);

// 4. Viết lại hàm apiCall sử dụng axiosInstance
export const apiCall = async (endpoint, options = {}) => {
  // Destructure các thuộc tính phổ biến từ options
  const { method = "GET", data, params, ...restOptions } = options;

  try {
    // Gọi axiosInstance với cấu hình đã chuẩn hóa
    const response = await axiosInstance({
      url: endpoint,
      method: method.toLowerCase(), // axios dùng method viết thường
      data: data, // Dữ liệu cho POST, PUT, PATCH sẽ tự động được stringify
      params: params, // Tham số query cho GET sẽ tự động được nối vào URL
      ...restOptions, // Các tùy chọn khác như headers (nếu muốn ghi đè)
    });
    // Interceptor response đã xử lý và trả về response.data hoặc thông điệp lỗi
    // nên chúng ta chỉ cần trả về kết quả từ interceptor
    return response;
  } catch (error) {
    // Interceptor response đã log lỗi và ném ra Error với message chuẩn hóa
    // Chỉ cần ném lỗi này ra ngoài để component có thể bắt và hiển thị bằng showToast
    throw error;
  }
};

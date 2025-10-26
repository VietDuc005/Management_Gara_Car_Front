// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi load app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Lỗi parse user data:", error);
        // Xóa dữ liệu lỗi
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập với API
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);

      if (response.success && response.data) {
        const {
          token,
          type,
          maTaiKhoan,
          tenDangNhap,
          email,
          vaiTro,
          trangThai,
        } = response.data;

        // Kiểm tra trạng thái tài khoản
        if (trangThai !== "Hoạt động") {
          throw new Error(
            "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên!"
          );
        }

        // Lưu token (LƯU cả 2 key để tương thích với code cũ)
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token); // Backward compatibility

        // Lưu thông tin user
        const userData = {
          maTaiKhoan,
          tenDangNhap,
          email,
          vaiTro,
          trangThai,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return response;
      } else {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Xử lý các trường hợp lỗi cụ thể
      if (error.message.includes("vô hiệu hóa")) {
        throw error; // Giữ nguyên message về tài khoản vô hiệu hóa
      }

      // Lỗi mặc định
      throw new Error(
        error.message || "Tên đăng nhập hoặc mật khẩu không chính xác!"
      );
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    // Xóa tất cả dữ liệu liên quan đến auth
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
  };

  // Kiểm tra quyền Quản lý
  const isManager = () => user?.vaiTro === "Quản lý";

  // Kiểm tra quyền Nhân viên
  const isEmployee = () => user?.vaiTro === "Nhân viên";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isManager,
        isEmployee,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

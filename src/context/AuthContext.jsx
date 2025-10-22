// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// 🔹 Tạo Context để quản lý thông tin người dùng
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng
  const [loading, setLoading] = useState(true); // Loading ban đầu (đang kiểm tra localStorage)

  // 🧩 Kiểm tra thông tin đăng nhập khi load app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ✅ Hàm đăng nhập (mock tạm)
  const login = (username) => {
    const newUser = {
      username,
      role: username === "admin" ? "admin" : "user",
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // ✅ Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ Kiểm tra quyền admin
  const isAdmin = () => user?.role === "admin";

  // 🧠 Trả về context
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook dùng ở mọi component
export const useAuth = () => useContext(AuthContext);

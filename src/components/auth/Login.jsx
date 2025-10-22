// src/components/auth/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Wrench, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-orange-100">
          {/* --- LOGO + TITLE --- */}
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-orange-100 rounded-full">
              <Wrench className="w-7 h-7 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 ml-3 tracking-tight">
              Garage Management
            </h1>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mb-6 text-center">
            Đăng nhập hệ thống quản lý gara
          </h2>

          {/* --- FORM --- */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập..."
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu..."
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* --- THÔNG BÁO LỖI --- */}
            {error && (
              <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* --- NÚT ĐĂNG NHẬP --- */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* --- FOOTER --- */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            © 2025 Garage Management System — Powered by React & Spring Boot
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

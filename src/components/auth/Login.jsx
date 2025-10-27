// src/components/auth/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Wrench, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginBackground from "./LoginBackground";

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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* ✅ Background chuyên nghiệp kiểu Garage */}
      <LoginBackground />

      {/* ✅ FORM LOGIN */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-10">
          
          {/* HEADER */}
          <div className="flex items-center justify-center mb-7">
            <div className="p-3 bg-orange-200/70 rounded-full shadow-sm">
              <Wrench className="w-7 h-7 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 ml-3">
              Garage Management
            </h1>
          </div>

          <p className="text-gray-600 text-center mb-6 font-medium">
            Đăng nhập hệ thống quản lý gara
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* USERNAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập..."
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg
                focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu..."
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg
                focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold
              shadow-md shadow-orange-700/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-xs text-gray-500 mt-6 text-center">
            © 2025 Garage Management System — React & Spring Boot
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

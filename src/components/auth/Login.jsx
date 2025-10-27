// src/components/auth/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Wrench, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginBackground from "./LoginBackground";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      <LoginBackground />

      <div className="relative z-10 w-full max-w-md px-6">
        <div
          className="bg-black/25 backdrop-blur-2xl rounded-3xl border border-orange-400/30
          shadow-[0_0_35px_rgba(255,120,40,0.3)] p-10 
          ring-1 ring-white/10 hover:ring-orange-400/40 
          transition duration-500"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-orange-500/30 rounded-xl shadow-orange-400/40 shadow">
              <Wrench className="w-9 h-9 text-orange-300 drop-shadow-[0_0_6px_orange]" />
            </div>
            <h1 className="text-3xl font-bold ml-3 bg-gradient-to-r from-orange-300 to-orange-600 bg-clip-text text-transparent">
              Garage Management
            </h1>
          </div>

          <p className="text-orange-200/90 text-center mb-6 font-medium">
            Đăng nhập hệ thống quản lý gara
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-orange-200 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                placeholder="admin / user..."
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-black/40 border border-orange-600/40 
                rounded-xl text-orange-100
                backdrop-blur-lg 
                focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                transition placeholder:text-gray-500 shadow-[inset_0_0_10px_rgba(255,120,40,0.15)]"
                required
              />
            </div>

            {/* Password + Eye */}
            <div>
              <label className="block text-sm font-semibold text-orange-200 mb-1">
                Mật khẩu
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-black/40 border border-orange-600/40 
                  rounded-xl text-orange-100
                  backdrop-blur-lg 
                  focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                  transition placeholder:text-gray-500 shadow-[inset_0_0_10px_rgba(255,120,40,0.15)]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                  text-orange-300 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-red-500/20">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black 
              font-bold py-3 rounded-xl
              shadow-xl shadow-orange-500/40
              hover:shadow-orange-500/80 hover:brightness-110
              hover:scale-[1.02] transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-[11px] text-gray-400 mt-6 text-center">
            © 2025 Garage Management ⚙ React & Spring Boot
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

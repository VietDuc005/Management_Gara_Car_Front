// src/components/auth/AccessDenied.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, ArrowRight } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-red-100 text-center">
          {/* Icon cảnh báo */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <ShieldOff className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Hệ thống cho nhân viên
          </h1>

          {/* Mô tả */}
          <p className="text-gray-600 mb-6">
            Bạn sẽ bị giới hạn một số phân quyền để truy cập trang này. Vui lòng
            liên hệ quản trị viên nếu bạn cho rằng đây là một sai lầm.
          </p>

          {/* Nút quay lại */}
          <button
            onClick={() => navigate("/sales")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold shadow-sm transition flex items-center justify-center gap-2"
          >
            {" "}
            Vào hệ thống
            <ArrowRight size={20} />
          </button>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-6">
            © 2025 Garage Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

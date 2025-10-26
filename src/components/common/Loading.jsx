import React from "react";
import { Car } from "lucide-react";

const Loading = ({
  message = "Đang tải dữ liệu...",
  subMessage = "Hệ thống Garage đang xử lý",
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center 
                    bg-gradient-to-br from-orange-500/20 to-amber-500/20 
                    backdrop-blur-md z-50 animate-fadeIn">

      {/* Tiêu đề */}
      <p className="text-xl font-bold text-gray-800 dark:text-white mb-4 animate-pulse">
        {message}
      </p>

      {/* Progress Bar Container */}
      <div className="relative w-80 h-4 bg-gray-200 dark:bg-gray-700 
                      rounded-full overflow-hidden shadow-md">

        {/* Progress fill chạy vòng */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r 
                        from-orange-500 via-amber-400 to-orange-500 
                        animate-progress" />

        {/* Xe chạy theo tiến trình */}
        <div className="absolute -top-7">
          <Car
            className="text-orange-600 animate-carRun drop-shadow-lg"
            size={32}
          />
        </div>
      </div>

      {/* Sub text */}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        {subMessage}
      </p>

      <style>
        {`
          @keyframes progressFill {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          @keyframes carRun {
            0% { transform: translateX(-10%) rotate(0deg); }
            50% { transform: translateX(360px) rotate(0deg); }
            51% { transform: translateX(360px) rotateY(180deg); }
            100% { transform: translateX(-10%) rotateY(180deg); }
          }

          .animate-progress {
            animation: progressFill 2s linear infinite;
          }

          .animate-carRun {
            animation: carRun 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loading;

// src/components/common/BoxOnView.jsx
import React from "react";
import {
  Package,
  Layers,
  Wrench,
  ShoppingBag,
  Users,
  FileText,
} from "lucide-react";

// 🔹 Map icon name sang component Lucide tương ứng
const iconMap = {
  package: <Package size={28} strokeWidth={1.6} />,
  layers: <Layers size={28} strokeWidth={1.6} />,
  wrench: <Wrench size={28} strokeWidth={1.6} />,
  "shopping-bag": <ShoppingBag size={28} strokeWidth={1.6} />,
  users: <Users size={28} strokeWidth={1.6} />,
  "file-text": <FileText size={28} strokeWidth={1.6} />,
};

const BoxOnView = ({ title, fields = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 transition-colors duration-300">
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-5 rounded-xl 
                        shadow-sm hover:shadow-md transition-all duration-300
                        ${item.bg || ""} border border-transparent hover:scale-[1.02]
                        dark:shadow-gray-900/30`}
          >
            {/* ICON */}
            <div
              className={`p-3 rounded-lg bg-white/60 dark:bg-gray-900/40 ${item.color}`}
            >
              {iconMap[item.icon] || <Package size={24} />} {/* fallback */}
            </div>

            {/* TEXT */}
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </h3>
              <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {item.value?.toLocaleString("vi-VN") ?? "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxOnView;

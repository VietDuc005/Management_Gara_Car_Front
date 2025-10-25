// src/components/common/StatsCard.jsx
import React from "react";

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        {change && (
          <p
            className={`text-sm font-semibold mt-1 ${
              change.startsWith("-") ? "text-red-500" : "text-green-600"
            }`}
          >
            {change}
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-md ${color}`}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatsCard;

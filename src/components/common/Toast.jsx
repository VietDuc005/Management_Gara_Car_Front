import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const toastTypes = {
  success: {
    icon: <CheckCircle className="text-green-500" />,
    style: "bg-white border-green-500",
    textStyle: "text-green-700",
  },
  error: {
    icon: <XCircle className="text-red-500" />,
    style: "bg-white border-red-500",
    textStyle: "text-red-700",
  },
};

const Toast = ({ message, type, onClose }) => {
  const [exiting, setExiting] = useState(false);
  const config = toastTypes[type] || toastTypes.error;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, 4000); // Auto-close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform ${
        config.style
      } ${
        exiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
      style={{ minWidth: "300px" }}
    >
      <div>{config.icon}</div>
      <div className={`flex-1 font-semibold ${config.textStyle}`}>
        {message}
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const toastTypes = {
  success: {
    icon: <CheckCircle className="text-green-500 dark:text-green-400" />,
    style:
      "bg-white dark:bg-gray-800 border-green-500 dark:border-green-400",
    textStyle: "text-green-700 dark:text-green-300",
  },
  error: {
    icon: <XCircle className="text-red-500 dark:text-red-400" />,
    style:
      "bg-white dark:bg-gray-800 border-red-500 dark:border-red-400",
    textStyle: "text-red-700 dark:text-red-300",
  },
};

const Toast = ({ message, type, onClose }) => {
  const [exiting, setExiting] = useState(false);
  const config = toastTypes[type] || toastTypes.error;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, 4000);

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
        className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;

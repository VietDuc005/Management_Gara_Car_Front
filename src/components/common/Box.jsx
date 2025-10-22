// src/components/common/Box.jsx
import React, { useState, useEffect } from "react";

const Box = ({ title, fields, onClose, onSubmit, initialData, mode = "add" }) => {
  const [form, setForm] = useState({});

  // Cập nhật state của form khi initialData thay đổi
  useEffect(() => {
    const obj = {};
    fields.forEach((f) => {
      obj[f.name] = initialData?.[f.name] || f.defaultValue || "";
    });
    setForm(obj);
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg p-6 w-[420px] relative animate-fade-in transition-colors duration-300">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          ✖
        </button>

        {/* Tiêu đề */}
        <h3 className="text-xl font-bold text-orange-500 mb-4">{title}</h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>

              {/* Chế độ xem hoặc chỉnh sửa */}
              {mode === "view" ? (
                <p className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-100">
                  {form[field.name] || "N/A"}
                </p>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors duration-300"
                >
                  {field.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors duration-300"
                />
              )}
            </div>
          ))}

          {/* Nút điều khiển */}
          <div className="flex justify-end mt-5 gap-3">
            {mode === "view" ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
              >
                Đóng
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                >
                  Lưu
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Box;

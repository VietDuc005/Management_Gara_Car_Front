// src/components/common/Box.jsx
import React, { useState, useEffect } from "react";
import Loading from "./Loading";

const Box = ({
  title,
  fields,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
}) => {
  const [form, setForm] = useState({});
  const [loading] = useState(false);

  useEffect(() => {
    const obj = {};
    fields.forEach((f) => {
      // Chỉ khởi tạo giá trị cho các trường không có hàm render tùy chỉnh,
      // vì state của chúng được quản lý bên ngoài.
      if (!f.render) {
        obj[f.name] = initialData?.[f.name] || f.defaultValue || "";
      }
    });
    setForm(obj);
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Khi submit, chỉ gửi đi state của các trường input mà Box quản lý.
    // Dữ liệu từ component render tùy chỉnh sẽ được gộp lại ở component cha.
    onSubmit(form);
  };

  if (loading) return <Loading />;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg p-6 w-[420px] relative animate-fade-in transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          ✖
        </button>

        <h3 className="text-xl font-bold text-orange-500 mb-4">{title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {fields.map((field) => (
            <div key={field.name || field.label}>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>

              {/* NÂNG CẤP: Nếu field có hàm render tùy chỉnh, hãy dùng nó */}
              {field.render ? (
                field.render()
              ) : mode === "view" ? (
                <p className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  {form[field.name] || "N/A"}
                </p>
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full input-style"
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
                  className="w-full input-style"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end mt-5 gap-3">
            {mode === "view" ? (
              <button type="button" onClick={onClose} className="btn-primary">
                Đóng
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    backgroundColor: "#e9ecef" /* Mã màu nền */,
                    color: "#495057" /* Mã màu chữ */,
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#fd7e14" /* Mã màu nền */,
                    color: "white" /* Mã màu chữ */,
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
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

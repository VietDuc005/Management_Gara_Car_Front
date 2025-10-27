import React from "react";
import Loading from "./Loading";
import { Eye, Edit, Trash2 } from "lucide-react";

function Table({ columns, data, onView, onEdit, onDelete, loading = false }) {
  if (loading) return <Loading />;
  return (
    <div className="table-responsive rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <table className="w-full text-sm text-gray-700 dark:text-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
            {(onView || onEdit || onDelete) && (
              <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                Thao tác
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}

                {(onView || onEdit || onDelete) && (
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {onDelete &&  row.trangThai !== "Đã xóa" && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

function Table({ columns, data, onView, onEdit, onDelete, loading = false }) {
  if (loading)
    return (
      <div className="p-6 text-center text-muted">
        <span className="spinner-border spinner-border-sm me-2"></span>
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="table-responsive rounded-lg border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 font-semibold text-gray-600 uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
            {(onView || onEdit || onDelete) && (
              <th className="text-center py-3 px-4 font-semibold text-gray-600 uppercase tracking-wide">
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
                className="border-b border-gray-100 hover:bg-gray-50 transition"
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
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
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
                className="text-center py-8 text-gray-500"
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

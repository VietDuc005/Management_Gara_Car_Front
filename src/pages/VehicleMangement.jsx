// src/pages/VehicleManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import { VehicleService } from "../services/VehicleService";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import Box from "../components/common/Box";
import ConfirmModal from "../components/common/ConfirmModal";
import { Plus } from "lucide-react";

// ========== Màu sắc trạng thái ==========
const getStatusColor = (status) => {
  switch (status) {
    case "Hoạt động":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Đã xóa":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const VehicleManagement = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchField, setSearchField] = useState("bienSo");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "maXe",
    sortDirection: "desc",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingData, setEditingData] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // ========== Debounce search ==========
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination((p) => ({ ...p, page: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ========== Fetch Data ==========
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { page, size } = pagination;
      const { sortBy, sortDirection } = sortConfig;
      let responseData;

      if (debouncedSearchTerm) {
        const criteria = { [searchField]: debouncedSearchTerm };
        responseData = await VehicleService.search(
          criteria,
          page,
          size,
          sortBy,
          sortDirection
        );
      } else {
        responseData = await VehicleService.getAll(
          page,
          size,
          sortBy,
          sortDirection
        );
      }

      console.log("🚗 API xe trả về:", responseData);

      // Hỗ trợ mọi kiểu dữ liệu backend trả
      if (responseData?.data?.content && Array.isArray(responseData.data.content)) {
        setVehicles(
          responseData.data.content.map((x) => ({ ...x, id: x.maXe }))
        );
        setPagination((p) => ({
          ...p,
          totalPages: responseData.data.totalPages || 1,
        }));
      } else if (responseData?.content && Array.isArray(responseData.content)) {
        setVehicles(responseData.content.map((x) => ({ ...x, id: x.maXe })));
        setPagination((p) => ({
          ...p,
          totalPages: responseData.totalPages || 1,
        }));
      } else if (Array.isArray(responseData)) {
        setVehicles(responseData.map((x) => ({ ...x, id: x.maXe })));
        setPagination((p) => ({ ...p, totalPages: 1 }));
      } else {
        setVehicles([]);
        setPagination((p) => ({ ...p, totalPages: 1, page: 0 }));
      }
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu xe:", err);
      showToast(err.message || "Không thể tải danh sách xe.", "error");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.size,
    sortConfig,
    debouncedSearchTerm,
    searchField,
    showToast,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ========== CRUD ==========
  const handleCreateNew = () => {
    setEditingData(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingData(row);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await VehicleService.delete(itemToDelete.maXe);
      showToast("Xóa xe thành công!", "success");
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (modalMode === "create") {
        await VehicleService.create(formData);
        showToast("Thêm mới xe thành công!", "success");
      } else {
        await VehicleService.update(editingData.maXe, formData);
        showToast("Cập nhật xe thành công!", "success");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ========== FORM FIELD ==========
  const VehicleFormFields = [
    { name: "bienSo", label: "Biển Số", type: "text", required: true },
    { name: "hangXe", label: "Hãng Xe", type: "text", required: true },
    { name: "dongXe", label: "Dòng Xe", type: "text" },
    { name: "namSanXuat", label: "Năm Sản Xuất", type: "number" },
    { name: "mauSac", label: "Màu Sắc", type: "text" },
    { name: "maKhachHang", label: "Mã Khách Hàng", type: "number" },
  ];

  const editVehicleFormFields = [
    ...VehicleFormFields,
    {
      name: "trangThai",
      label: "Trạng Thái",
      type: "select",
      options: ["Hoạt động", "Đã xóa"],
      required: true,
    },
  ];

  // ========== SEARCH & SORT ==========
  const sortOptions = [
    { value: "maXe", label: "Sắp xếp theo Mã xe" },
    { value: "bienSo", label: "Sắp xếp theo Biển số" },
  ];

  const searchOptions = [
    { value: "bienSo", label: "Tìm theo Biển Số" },
    { value: "hangXe", label: "Tìm theo Hãng Xe" },
    { value: "namSanXuat", label: "Tìm theo Năm Sản Xuất" },
    { value: "mauSac", label: "Tìm theo Màu Sắc" },
    { value: "trangThai", label: "Tìm theo Trạng Thái" },
  ];

  // ========== TABLE ==========
  const columns = [
    { key: "maXe", label: "Mã Xe" },
    { key: "bienSo", label: "Biển Số" },
    { key: "hangXe", label: "Hãng Xe" },
    { key: "dongXe", label: "Dòng Xe" },
    { key: "namSanXuat", label: "Năm Sản Xuất" },
    { key: "mauSac", label: "Màu Sắc" },
    {
      key: "trangThai",
      label: "Trạng Thái",
      render: (v) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            v
          )}`}
        >
          {v}
        </span>
      ),
    },
    { key: "maKhachHang", label: "Mã Khách Hàng" },
  ];

  // ========== UI ==========
  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl shadow transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Quản lý Xe
        </h2>
       
      </div>

      {/* Search & Sort */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center
 transition-colors duration-300">
  <div className="w-full sm:w-auto flex-1 min-w-[250px]">
   <SearchWithOptions
          searchField={searchField}
          searchTerm={searchTerm}
          onSearchFieldChange={setSearchField}
          onSearchTermChange={setSearchTerm}
          options={searchOptions}
          placeholder="Nhập giá trị tìm kiếm..."
        />
</div>

       
        <SortControls
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          options={sortOptions}
        />
         <button
          onClick={handleCreateNew}
          className="w-full sm:w-auto justify-center active:scale-95 shadow-sm
 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md transition-colors duration-300">
        <Table
          columns={columns}
          data={vehicles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(newPage) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
      />

      {/* Form Box */}
      {isModalOpen && (
        <Box
          title={modalMode === "create" ? "Thêm mới Xe" : "Cập nhật Xe"}
          fields={
            modalMode === "create" ? VehicleFormFields : editVehicleFormFields
          }
          initialData={editingData}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          mode={modalMode}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa Xe"
      >
        <p>
          Bạn có chắc chắn muốn xóa xe{" "}
          <strong className="text-red-600">
            "{itemToDelete?.bienSo}"
          </strong>
          ?
        </p>
      </ConfirmModal>
    </div>
  );
};

export default VehicleManagement;

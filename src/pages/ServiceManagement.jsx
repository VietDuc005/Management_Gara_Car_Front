import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { serviceService } from "../services/serviceService";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import ServiceFormModal from "../components/common/ServiceFormModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { Plus } from "lucide-react";
import { formatCurrency, formatDateTime } from "../utils/helpers";

const getStatusColor = (status) => {
  switch (status) {
    case "Còn hàng":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Hết hàng":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Sắp hết":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "Đã xóa":
      return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const ServiceManagement = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // States for search, sort, pagination
  const [searchField, setSearchField] = useState("tenDichVu");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "ngayTao",
    sortDirection: "desc",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination((p) => ({ ...p, page: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { page, size } = pagination;
      const { sortBy, sortDirection } = sortConfig;
      let responseData;

      if (debouncedSearchTerm) {
        const criteria = { [searchField]: debouncedSearchTerm };
        responseData = await serviceService.search(
          criteria,
          page,
          size,
          sortBy,
          sortDirection
        );
      } else {
        responseData = await serviceService.getAll(
          page,
          size,
          sortBy,
          sortDirection
        );
      }

      if (responseData?.content) {
        setServices(
          responseData.content.map((item) => ({ ...item, id: item.maDichVu }))
        );
        setPagination((p) => ({
          ...p,
          totalPages: responseData.totalPages || 1,
        }));
      } else {
        setServices([]);
        setPagination((p) => ({ ...p, totalPages: 1, page: 0 }));
      }
    } catch (err) {
      showToast(err.message || "Không thể tải danh sách dịch vụ.", "error");
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

  // === EVENT HANDLERS ===
  const handleViewDetails = (row) =>
    navigate(`/services/${row.maDichVu}`, { state: { serviceData: row } });

  const handleCreateNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      setLoading(true);
      if (editingItem) {
        const response = await serviceService.update(
          editingItem.maDichVu,
          formData
        );
        showToast(response.message || "Cập nhật thành công!", "success");
      } else {
        const response = await serviceService.create(formData);
        showToast(response.message || "Thêm mới thành công!", "success");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      const response = await serviceService.delete(itemToDelete.maDichVu);
      showToast(response.message || "Xóa dịch vụ thành công!", "success");
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // === UI CONFIG ===
  const columns = [
    { key: "maDichVu", label: "Mã DV" },
    { key: "tenDichVu", label: "Tên Dịch Vụ" },
    {
      key: "gia",
      label: "Giá",
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
    { key: "soLuongTon", label: "Tồn kho" },
    { key: "soLuongBan", label: "Đã bán" },
    {
      key: "trangThai",
      label: "Trạng Thái",
      render: (value) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    { key: "tenLoaiDichVu", label: "Loại Dịch Vụ" },
    {
      key: "ngayTao",
      label: "Ngày Tạo",
      render: (value) => formatDateTime(value),
    },
  ];

  const searchOptions = [
    { value: "tenDichVu", label: "Tìm theo Tên Dịch vụ" },
    { value: "loaiDichVu", label: "Tìm theo Loại Dịch vụ" },
  ];

  const sortOptions = [
    { value: "ngayTao", label: "Sắp xếp theo Ngày tạo" },
    { value: "tenDichVu", label: "Sắp xếp theo Tên" },
    { value: "gia", label: "Sắp xếp theo Giá" },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Quản lý Dịch vụ
        </h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Thêm dịch vụ
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <SearchWithOptions
          {...{
            searchField,
            searchTerm,
            options: searchOptions,
            onSearchFieldChange: setSearchField,
            onSearchTermChange: setSearchTerm,
            placeholder: "Nhập tên hoặc loại dịch vụ...",
          }}
        />
        <SortControls
          {...{ sortConfig, options: sortOptions, onSortChange: setSortConfig }}
        />
      </div>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md overflow-x-auto">
        <Table
          {...{
            columns,
            data: services,
            loading,
            onView: handleViewDetails,
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
        />
      </div>
      <Pagination
        {...{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: (p) => setPagination((prev) => ({ ...prev, page: p })),
        }}
      />

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        mode={editingItem ? "edit" : "create"}
        initialData={editingItem}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa dịch vụ"
        message={`Bạn có chắc chắn muốn xóa dịch vụ "${
          itemToDelete?.tenDichVu || ""
        }" không?`}
      />
    </div>
  );
};

export default ServiceManagement;

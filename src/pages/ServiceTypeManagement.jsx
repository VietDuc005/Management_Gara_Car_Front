import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import Box from "../components/common/Box";
import ConfirmModal from "../components/common/ConfirmModal";
import { serviceTypeService } from "../services/serviceTypeService";
import { formatDate } from "../utils/helpers";
import { Plus } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "Hoạt động":
      return "bg-green-100 text-green-800";
    case "Đã xóa":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ServiceTypeManagement = () => {
  const { showToast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("tenLoai");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "tenLoai",
    sortDirection: "asc",
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingData, setEditingData] = useState(null);

  // State để quản lý modal xác nhận
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { page, size } = pagination;
      const { sortBy, sortDirection } = sortConfig;
      let responseData;
      if (debouncedSearchTerm) {
        const searchCriteria = { [searchField]: debouncedSearchTerm };
        responseData = await serviceTypeService.search(
          searchCriteria,
          page,
          size,
          sortBy,
          sortDirection
        );
      } else {
        responseData = await serviceTypeService.getAll(
          page,
          size,
          sortBy,
          sortDirection
        );
      }
      if (responseData && responseData.content) {
        setData(
          responseData.content.map((item) => ({ ...item, id: item.maLoai }))
        );
        setPagination((prev) => ({
          ...prev,
          totalPages: responseData.totalPages || 1,
        }));
      } else {
        setData([]);
        setPagination((prev) => ({ ...prev, totalPages: 1, page: 0 }));
      }
    } catch (err) {
      showToast(err.message || "Không thể tải danh sách.", "error");
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
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination((p) => ({ ...p, page: 0 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      const response = await serviceTypeService.delete(itemToDelete.maLoai);
      showToast(response.message || "Xóa thành công!", "success");
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
      let response;
      if (modalMode === "create") {
        response = await serviceTypeService.create(formData);
        showToast(response.message || "Thêm mới thành công!", "success");
      } else {
        const payload = {};
        if (formData.tenLoai && formData.tenLoai.trim() !== "") {
          payload.tenLoai = formData.tenLoai;
        }
        if (formData.trangThai) {
          payload.trangThai = formData.trangThai;
        }

        response = await serviceTypeService.update(editingData.maLoai, payload);
        showToast(response.message || "Cập nhật thành công!", "success");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const createServiceTypeFields = [
    {
      name: "tenLoai",
      label: "Tên Loại Dịch Vụ",
      type: "text",
      required: true,
      defaultValue: "",
    },
  ];

  const editServiceTypeFields = [
    { name: "tenLoai", label: "Tên Loại Dịch Vụ Mới", type: "text" },
    {
      name: "trangThai",
      label: "Trạng Thái",
      type: "select",
      options: ["Hoạt động", "Đã xóa"],
      required: true,
    },
  ];

  const sortOptions = [
    { value: "tenLoai", label: "Sắp xếp theo Tên" },
    { value: "ngayTao", label: "Sắp xếp theo Ngày tạo" },
  ];
  const searchOptions = [
    { value: "tenLoai", label: "Tìm theo Tên" },
    { value: "trangThai", label: "Tìm theo Trạng thái" },
  ];
  const columns = [
    { key: "maLoai", label: "Mã Loại" },
    { key: "tenLoai", label: "Tên Loại Dịch Vụ" },
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
    { key: "ngayTao", label: "Ngày Tạo", render: (value) => formatDate(value) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800">
          Quản lý Loại Dịch vụ
        </h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <SearchWithOptions
          searchField={searchField}
          searchTerm={searchTerm}
          onSearchFieldChange={setSearchField}
          onSearchTermChange={setSearchTerm}
          options={searchOptions}
          placeholder="Nhập giá trị cần tìm..."
        />
        <SortControls
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          options={sortOptions}
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <Table
          columns={columns}
          data={data}
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

      {isModalOpen && (
        <Box
          title={
            modalMode === "create"
              ? "Thêm mới Loại Dịch vụ"
              : "Cập nhật Loại Dịch vụ"
          }
          fields={
            modalMode === "create"
              ? createServiceTypeFields
              : editServiceTypeFields
          }
          initialData={editingData}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          mode={modalMode}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa loại dịch vụ"
      >
        <p>
          Bạn có chắc chắn muốn xóa loại dịch vụ{" "}
          <strong className="text-red-600">"{itemToDelete?.tenLoai}"</strong>{" "}
          không? Hành động này không thể được hoàn tác.
        </p>
      </ConfirmModal>
    </div>
  );
};

export default ServiceTypeManagement;

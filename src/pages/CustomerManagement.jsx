import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import Box from "../components/common/Box";
import ConfirmModal from "../components/common/ConfirmModal";
import { customerService } from "../services/customerService";
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

const CustomerManagement = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchField, setSearchField] = useState("tenKhachHang");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "tenKhachHang",
    sortDirection: "asc",
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingData, setEditingData] = useState(null);

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
        responseData = await customerService.search(
          searchCriteria,
          page,
          size,
          sortBy,
          sortDirection
        );
      } else {
        responseData = await customerService.getAll(
          page,
          size,
          sortBy,
          sortDirection
        );
      }

      if (responseData && responseData.content) {
        setCustomers(
          responseData.content.map((item) => ({
            ...item,
            id: item.maKhachHang,
          }))
        );
        setPagination((prev) => ({
          ...prev,
          totalPages: responseData.totalPages || 1,
        }));
      } else {
        setCustomers([]);
        setPagination((prev) => ({ ...prev, totalPages: 1, page: 0 }));
      }
    } catch (err) {
      showToast(err.message || "Không thể tải danh sách khách hàng.", "error");
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
      await customerService.delete(itemToDelete.maKhachHang);
      showToast("Xóa khách hàng thành công!", "success");
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
        await customerService.create(formData);
        showToast("Thêm mới khách hàng thành công!", "success");
      } else {
        await customerService.update(editingData.maKhachHang, formData);
        showToast("Cập nhật khách hàng thành công!", "success");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const customerFormFields = [
    {
      name: "tenKhachHang",
      label: "Tên Khách Hàng",
      type: "text",
      required: true,
      defaultValue: "",
    },
    {
      name: "soDienThoai",
      label: "Số Điện Thoại",
      type: "text",
      required: true,
      defaultValue: "",
    },
    { name: "email", label: "Email", type: "email", defaultValue: "" },
    { name: "diaChi", label: "Địa Chỉ", type: "text", defaultValue: "" },
    {
      name: "loaiKhach",
      label: "Loại Khách",
      type: "select",
      options: ["Cá nhân", "Doanh nghiệp"],
      defaultValue: "Cá nhân",
    },
    { name: "ghiChu", label: "Ghi Chú", type: "textarea", defaultValue: "" },
  ];

  const editCustomerFormFields = [
    ...customerFormFields,
    {
      name: "trangThai",
      label: "Trạng Thái",
      type: "select",
      options: ["Hoạt động", "Đã xóa"],
      required: true,
    },
  ];

  const sortOptions = [
    { value: "tenKhachHang", label: "Sắp xếp theo Tên" },
    { value: "loaiKhach", label: "Sắp xếp theo Loại Khách Hàng" },
  ];
  const searchOptions = [
    { value: "tenKhachHang", label: "Tìm theo Tên" },
    { value: "soDienThoai", label: "Tìm theo Số điện thoại" },
    { value: "email", label: "Tìm theo Email" },
    { value: "loaiKhach", label: "Tìm theo Loại Khách" },
    { value: "trangThai", label: "Tìm theo Trạng Thái" },
  ];
  const columns = [
    { key: "maKhachHang", label: "Mã Khách Hàng" },
    { key: "tenKhachHang", label: "Tên Khách Hàng" },
    { key: "soDienThoai", label: "Số Điện Thoại" },
    { key: "email", label: "Email" },
    { key: "diaChi", label: "Địa Chỉ" },
    { key: "loaiKhach", label: "Loại Khách " },
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800">Quản lý Khách hàng</h2>
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
          data={customers}
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
              ? "Thêm mới Khách hàng"
              : "Cập nhật Khách hàng"
          }
          fields={
            modalMode === "create" ? customerFormFields : editCustomerFormFields
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
        title="Xác nhận xóa khách hàng"
      >
        <p>
          Bạn có chắc chắn muốn xóa khách hàng{" "}
          <strong className="text-red-600">
            "{itemToDelete?.tenKhachHang}"
          </strong>
          ?
        </p>
      </ConfirmModal>
    </div>
  );
};

export default CustomerManagement;

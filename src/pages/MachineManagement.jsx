import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import Box from "../components/common/Box";
import ConfirmModal from "../components/common/ConfirmModal";
import { machineService } from "../services/machineService";
import { Plus } from "lucide-react";

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


const MachineManagement = () => {
  const { showToast } = useToast();
  const [machine, setMachine] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchField, setSearchField] = useState("ngayVaoLam");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "ngayVaoLam",
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
        responseData = await machineService.search(
          searchCriteria,
          page,
          size,
          sortBy,
          sortDirection
        );
      } else {
        responseData = await machineService.getAll(
          page,
          size,
          sortBy,
          sortDirection
        );
      }

      if (responseData && responseData.content) {
        setMachine(
          responseData.content.map((item) => ({
            ...item,
            id: item.maTho,
          }))
        );
        setPagination((prev) => ({
          ...prev,
          totalPages: responseData.totalPages || 1,
        }));
      } else {
        setMachine([]);
        setPagination((prev) => ({ ...prev, totalPages: 1, page: 0 }));
      }
    } catch (err) {
      showToast(err.message || "Không thể tải danh sách thợ.", "error");
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
      await machineService.delete(itemToDelete.maTho);
      showToast("Xóa thợ thành công!", "success");
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
        await machineService.create(formData);
        showToast("Thêm mới thợ thành công!", "success");
      } else {
        await machineService.update(editingData.maTho, formData);
        showToast("Cập nhật khách hàng thành công!", "success");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const machineFormFields = [
    {
      name: "tenTho",
      label: "Tên Thợ",
      type: "text",
      required: true,
      defaultValue: "",
    },
    {
      name: "chuyenMon",
      label: "Chuyên Môn",
      type: "text",
      required: true,
      defaultValue: "",
    },
    { name: "soDienThoai", label: "Số Điện Thoại", type: "text",require: true , defaultValue: "" },
    { name: "email", label: "Email", type: "email", defaultValue: "" },
    {
      name: "kinhNghiem",
      label: "Kinh Nghiệm",
      type: "text",
      defaultValue: "",
    },
    { name: "ngayVaoLam", label: "Ngày Vào Làm", type: "Date", defaultValue: "" },
  ];

  const editMachineFormFields = [
    ...machineFormFields,
    {
      name: "trangThai",
      label: "Trạng Thái",
      type: "select",
      options: ["Hoạt động", "Đã xóa"],
      required: true,
    },
  ];

  const sortOptions = [
    { value: "tenTho", label: "Sắp xếp theo Tên" },
    { value: "chuyenMon", label: "Sắp xếp theo Chuyên Môn" },
  ];
  const searchOptions = [
    { value: "tenTho", label: "Tìm theo Tên" },
    { value: "chuyenMon", label: "Tìm theo Chuyên môn" },
    { value: "trangThai", label: "Tìm theo Trạng thái" },
    
  ];
  const columns = [
    { key: "maTho", label: "Mã Thợ" },
    { key: "tenTho", label: "Tên Thợ" },
    { key: "chuyenMon", label: "Chuyên Môn" },
    { key: "soDienThoai", label: "Số Điện Thoại" },
    { key: "email", label: "Email" },
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
    { key: "kinhNghiem", label: "Kinh Nghiệm " },
    { key: "ngayVaoLam", label: "Ngày Vào Làm " },
  ];

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl shadow transition-colors duration-300">
  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Quản lý Thợ</h2>

        
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center
 transition-colors duration-300">
  <div className="w-full sm:w-auto flex-1 min-w-[250px]">
   <SearchWithOptions
          searchField={searchField}
          searchTerm={searchTerm}
          onSearchFieldChange={setSearchField}
          onSearchTermChange={setSearchTerm}
          options={searchOptions}
          placeholder="Nhập giá trị cần tìm..."
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
 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold 
 hover:bg-orange-600 transition-all duration-200 transition-colors duration-300 "
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md transition-colors duration-300">

        <Table
          columns={columns}
          data={machine}
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
              ? "Thêm mới Thợ"
              : "Cập nhật Khách hàng"
          }
          fields={
            modalMode === "create" ? machineFormFields : editMachineFormFields
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
        title="Xác nhận xóa Thợ"
      >
        <p>
          Bạn có chắc chắn muốn xóa thợ{" "}
          <strong className="text-red-600">
            "{itemToDelete?.tenTho}"
          </strong>
          ?
        </p>
      </ConfirmModal>
    </div>
  );
};

export default MachineManagement;

import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import Box from "../components/common/Box";
import BoxOnView from "../components/common/BoxOnView";
import ConfirmModal from "../components/common/ConfirmModal";
import { machineService } from "../services/machineService";
import { Plus } from "lucide-react";
import Loading from "../components/common/Loading";

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
  const[overview,setOverview] = useState(null);
  const [searchField, setSearchField] = useState("tenTho");
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
            soDienThoai: formatPhoneNumberForDisplay(item.soDienThoai),
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
// ======== GỌI API: TỔNG QUAN ========
  const fetchOverview = useCallback(async () => {
    try {
      const res = await machineService.getthongkeTho();
      setOverview(res.data || res);
    } catch (err) {
      console.error("❌ Lỗi khi tải tổng quan:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

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
  const formatPhoneNumberForDisplay = (phone) => {
  if (!phone) return "";
  // Loại bỏ khoảng trắng
  phone = phone.replace(/\s+/g, "");
  // Nếu bắt đầu bằng +84 → chuyển thành 0
  if (phone.startsWith("+84")) {
    phone = "0" + phone.slice(3);
  }
  return phone;
};
const [formErrors, setFormErrors] = useState({}); 
const [currentFormData, setCurrentFormData] = useState({});
 const handleSave = async (formData) => {
  const errors = {}; // ✅ Bổ sung khai báo lỗi

  // 🚧 Kiểm tra trống
  if (!formData.tenTho?.trim()) {
    errors.tenTho = "Vui lòng nhập tên thợ.";
  }
  if (!formData.chuyenMon?.trim()) {
    errors.chuyenMon = "Vui lòng nhập chuyên môn.";
  }
  if (!formData.soDienThoai?.trim()) {
    errors.soDienThoai = "Vui lòng nhập số điện thoại.";
  }

 


  // 🚧 Kiểm tra định dạng số điện thoại VN
  const phonePattern = /^(0(32|33|34|35|36|37|38|39|56|57|58|59|70|71|72|73|74|75|76|77|78|79|81|82|83|84|85|88|89|90|91|92|93|94|96|97|98|99)\d{7}|\+84(32|33|34|35|36|37|38|39|56|57|58|59|70|71|72|73|74|75|76|77|78|79|81|82|83|84|85|88|89|90|91|92|93|94|96|97|98|99)\d{7})$/;

const validNumbers = [
  "0321234567",
  "0389876543",
  "0961234567",
  "0701234567",
  "0897654321",
  "0912345678",
  "0812345678",
  "0561234567",
  "0921234567",
  "0591234567",
  "+84321234567",
  "+84961234567",
  "+84701234567",
  "+84181234567",
  "+84561234567"
];

const invalidNumbers = [
  "0311234567",
  "090123456",
  "09012345678",
  "0123456789",
  "09991234",
  "+840901234567",
  "+8499123456",
  "1234567890",
  "0781234567",
  "08512345678",
  "abcdefghij"
];

console.log("===== VALID NUMBERS =====");
validNumbers.forEach(num => {
  console.log(`${num} => ${phonePattern.test(num) ? "PASS ✅" : "FAIL ❌"}`);
});

console.log("\n===== INVALID NUMBERS =====");
invalidNumbers.forEach(num => {
  console.log(`${num} => ${phonePattern.test(num) ? "FAIL ❌" : "PASS ✅"}`);
});

  if (
    formData.soDienThoai &&
    !phonePattern.test(formData.soDienThoai)
  ) {
    errors.soDienThoai =
      "Số điện thoại không hợp lệ. Chỉ nhận số của các mạng VN (Viettel, Mobifone, Vinaphone, Vietnamobile, Gmobile). Nhập theo dạng 0xxxxxxxxx hoặc +84xxxxxxxx (vd: 0901234567, +84901234567)";
  }

  // 🚧 Kiểm tra email
  if (!formData.email?.trim()) {
    errors.email = "Email không được để trống.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email không hợp lệ.";
  }

  // 🚧 Kiểm tra kinh nghiệm
    if (formData.kinhNghiem?.toString().trim()) {
    const kinhNghiemValue = Number(formData.kinhNghiem);
    if (isNaN(kinhNghiemValue)) {
      errors.kinhNghiem = "Kinh nghiệm phải là số.";
    } else if (kinhNghiemValue < 0) {
      errors.kinhNghiem = "Kinh nghiệm không được âm.";
    } else if (kinhNghiemValue > 50) {
      errors.kinhNghiem = "Kinh nghiệm không được vượt quá 50 năm.";
    }
  } else {
    // 🚀 Nếu bỏ trống hoặc null → gán mặc định = 0
    formData.kinhNghiem = 0;
  }

  // 🚨 Nếu có lỗi → hiển thị, focus vào ô đầu tiên
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    setCurrentFormData(formData);
    showToast(Object.values(errors)[0], "error");

    const firstErrorField = Object.keys(errors)[0];
    setTimeout(() => {
      const input =
        document.getElementById(firstErrorField) ||
        document.querySelector(`[name="${firstErrorField}"]`);
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
    return;
  }

  // ✅ Nếu không có lỗi → reset lỗi, tiến hành submit
  setFormErrors({});
  try {
    if (modalMode === "create") {
      await machineService.create(formData);
      showToast("Thêm mới thợ thành công!", "success");
    } else {
      await machineService.update(editingData.maTho, formData);
      showToast("Cập nhật thợ thành công!", "success");
    }

    setIsModalOpen(false);
    setCurrentFormData({});
    fetchData();
  } catch (err) {
    showToast(err.message, "error");
  }
};


 const overviewFields = overview
    ? [
        {
          label: "Tổng số Thợ",
          value: overview.totalTho,
          icon: "package",
          color: "text-orange-500",
          bg: "bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40",
          border: "border-l-4 border-orange-400",
          
        },
        {
          label: "Số thợ kinh nghiệm cao",
          value: overview.kinhNghiemCao,
          icon: "layers",
          color: "text-sky-500",
          bg: "bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300 dark:from-sky-900/40 dark:via-sky-800/40 dark:to-sky-700/40",
          border: "border-l-4 border-sky-400",
          
        },
        {
          label: "Số thợ kinh nghiệm thấp",
          value: overview.kinhNghiemThap,
          icon: "wrench",
          color: "text-emerald-500",
          bg: "bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-900/40 dark:via-emerald-800/40 dark:to-emerald-700/40",
          border: "border-l-4 border-emerald-400",
          
        },
        
      ]
    : [];
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
    { value: "soDienThoai", label: "Tìm theo Số Điện Thoại" },
    { value: "kinhNghiem", label: "Tìm theo Kinh nghiệm" },
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

  if (loading) return <Loading />;
  return (
    <div className="space-y-6 transition-colors duration-300">
      <BoxOnView title="Tổng quan Thợ" fields={overviewFields} />
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
        : "Cập nhật Thợ"
    }
    fields={
      modalMode === "create" ? machineFormFields : editMachineFormFields
    }
    initialData={Object.keys(currentFormData).length > 0 ? currentFormData : editingData}
    onClose={() => {
      setIsModalOpen(false);
      setCurrentFormData({}); // reset khi đóng form
    }}
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

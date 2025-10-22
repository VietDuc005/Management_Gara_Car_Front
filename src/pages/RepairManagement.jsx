import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import { repairService } from "../services/repairService";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import RepairDetailsModal from "../components/common/RepairDetailsModal";
import { Plus } from "lucide-react";
import { formatDate, formatCurrency } from "../utils/helpers";

const getStatusColor = (status) => {
  switch (status) {
    case "Hoàn thành":
      return "bg-green-100 text-green-800";
    case "Đã giao":
      return "bg-blue-100 text-blue-800";
    case "Đang sửa":
      return "bg-blue-100 text-blue-800";
    case "Chờ xử lý":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const RepairManagement = () => {
  const { showToast } = useToast();
  const [repairs, setRepairs] = useState([]);
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
    sortBy: "ngayLap",
    sortDirection: "desc",
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

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
        responseData = await repairService.search(
          criteria,
          page,
          size,
          sortBy,
          sortDirection
        );
      } else {
        responseData = await repairService.getAll(
          page,
          size,
          sortBy,
          sortDirection
        );
      }

      // ✅ API trả về: {success, message, data: {content: [], totalPages: ...}}
      if (
        responseData?.data?.content &&
        Array.isArray(responseData.data.content)
      ) {
        // Sử dụng đúng key `maPhieu` cho `id`
        setRepairs(
          responseData.data.content.map((r) => ({ ...r, id: r.maPhieu }))
        );
        setPagination((p) => ({
          ...p,
          totalPages: responseData.data.totalPages || 1,
        }));
      } else if (responseData?.content && Array.isArray(responseData.content)) {
        // Fallback: data trực tiếp ở root level
        setRepairs(responseData.content.map((r) => ({ ...r, id: r.maPhieu })));
        setPagination((p) => ({
          ...p,
          totalPages: responseData.totalPages || 1,
        }));
      } else if (Array.isArray(responseData)) {
        // Fallback: trả về trực tiếp array
        setRepairs(responseData.map((r) => ({ ...r, id: r.maPhieu })));
        setPagination((p) => ({ ...p, totalPages: 1 }));
      } else {
        setRepairs([]);
        setPagination((p) => ({ ...p, totalPages: 1, page: 0 }));
      }
    } catch (err) {
      showToast(
        err.message || "Không thể tải danh sách phiếu sửa chữa.",
        "error"
      );
      setRepairs([]);
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

  const handleViewDetails = (row) => {
    setSelectedRepair(row);
    setIsDetailModalOpen(true);
  };

  // ✅ Cập nhật columns với đầy đủ thông tin từ API
  const columns = [
    { key: "maPhieu", label: "Mã Phiếu" },
    { key: "maXe", label: "Mã Xe" },
    { key: "bienSo", label: "Biển Số" },
    { key: "maTho", label: "Mã Thợ" },
    { key: "tenTho", label: "Thợ Phụ Trách" },
    { key: "ngayLap", label: "Ngày Lập", render: (value) => formatDate(value) },
    {
      key: "moTa",
      label: "Mô Tả",
      render: (value) => (
        <span
          className="text-sm text-gray-600 max-w-xs truncate block"
          title={value}
        >
          {value}
        </span>
      ),
    },
    {
      key: "trangThai",
      label: "Trạng Thái",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "tongTien",
      label: "Tổng Tiền",
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
  ];

  const searchOptions = [
    { value: "bienSo", label: "Tìm theo Biển số" },
    { value: "trangThai", label: "Tìm theo Trạng thái" },
  ];

  const sortOptions = [
    { value: "ngayLap", label: "Sắp xếp theo Ngày lập" },
    { value: "tongTien", label: "Sắp xếp theo Tổng tiền" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800">
          Quản lý Phiếu Sửa Chữa
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition">
          <Plus size={18} /> Lập phiếu mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <SearchWithOptions
          {...{
            searchField,
            searchTerm,
            options: searchOptions,
            onSearchFieldChange: setSearchField,
            onSearchTermChange: setSearchTerm,
            placeholder: "Nhập giá trị tìm kiếm...",
          }}
        />
        <SortControls
          {...{ sortConfig, options: sortOptions, onSortChange: setSortConfig }}
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <Table
          {...{ columns, data: repairs, loading, onView: handleViewDetails }}
        />
      </div>

      <Pagination
        {...{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: (p) => setPagination((prev) => ({ ...prev, page: p })),
        }}
      />

      <RepairDetailsModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedRepair}
      />
    </div>
  );
};

export default RepairManagement;

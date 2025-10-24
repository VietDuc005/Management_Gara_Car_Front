import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import { invoiceService } from "../services/invoiceService";
import Table from "../components/common/Table";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import InvoiceDetailsModal from "../components/common/InvoiceDetailsModal";
import UpdateInvoiceModal from "../components/common/UpdateInvoiceModal";
import SearchWithOptions from "../components/common/SearchBar";
import { formatDateTime, formatCurrency } from "../utils/helpers";

const getStatusColor = (status) => {
  switch (status) {
    case "Đã thanh toán":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Chưa thanh toán":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Đã hủy":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const InvoiceManagement = () => {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchField, setSearchField] = useState("trangThai");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: "ngayLapHoaDon",
    sortDirection: "desc",
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // State cho modal update
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [invoiceToUpdate, setInvoiceToUpdate] = useState(null);

  // Debounce tìm kiếm
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
        responseData = await invoiceService.search(
          criteria,
          page,
          size,
          sortBy,
          sortDirection
        );
      } else {
        responseData = await invoiceService.getAll(
          page,
          size,
          sortBy,
          sortDirection
        );
      }

      if (responseData?.data?.content) {
        setInvoices(
          responseData.data.content.map((item) => ({
            ...item,
            id: item.maHoaDon,
          }))
        );
        setPagination((p) => ({
          ...p,
          totalPages: responseData.data.totalPages || 1,
        }));
      } else if (responseData?.content) {
        setInvoices(
          responseData.content.map((item) => ({ ...item, id: item.maHoaDon }))
        );
        setPagination((p) => ({
          ...p,
          totalPages: responseData.totalPages || 1,
        }));
      } else {
        setInvoices([]);
        setPagination((p) => ({ ...p, totalPages: 1, page: 0 }));
      }
    } catch (err) {
      showToast(err.message || "Không thể tải danh sách hóa đơn.", "error");
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
    setSelectedInvoice(row);
    setIsDetailModalOpen(true);
  };

  // Handler cho nút Sửa
  const handleEdit = (row) => {
    setInvoiceToUpdate(row);
    setIsUpdateModalOpen(true);
  };

  // Handler lưu cập nhật
  const handleUpdateSave = async (fieldName, newValue) => {
    try {
      let response;

      if (fieldName === "trangThai") {
        response = await invoiceService.updateStatus(
          invoiceToUpdate.maHoaDon,
          newValue
        );
      } else if (fieldName === "kieuThanhToan") {
        response = await invoiceService.updatePaymentMethod(
          invoiceToUpdate.maHoaDon,
          newValue
        );
      }

      if (response?.success) {
        showToast(response.message || "Cập nhật thành công!", "success");
        setIsUpdateModalOpen(false);
        fetchData(); // Refresh danh sách
      } else {
        showToast("Cập nhật thất bại!", "error");
      }
    } catch (err) {
      showToast(err.message || "Có lỗi xảy ra khi cập nhật!", "error");
    }
  };

  const columns = [
    { key: "maHoaDon", label: "Mã HĐ" },
    { key: "maPhieu", label: "Mã P.Sửa" },
    {
      key: "ngayLapHoaDon",
      label: "Ngày Lập",
      render: (value) => formatDateTime(value),
    },
    {
      key: "thoiGianThanhCong",
      label: "Ngày TT",
      render: (value) => formatDateTime(value),
    },
    { key: "kieuThanhToan", label: "Kiểu TT" },
    {
      key: "tongTien",
      label: "Tổng Tiền",
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
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

  const sortOptions = [
    { value: "ngayLapHoaDon", label: "Sắp xếp theo Ngày lập" },
    { value: "tongTien", label: "Sắp xếp theo Tổng tiền" },
  ];

  const searchOptions = [{ value: "trangThai", label: "Tìm theo Trạng thái" }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Quản lý Hóa đơn
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <SearchWithOptions
          searchField={searchField}
          searchTerm={searchTerm}
          onSearchFieldChange={setSearchField}
          onSearchTermChange={setSearchTerm}
          options={searchOptions}
          placeholder="Nhập trạng thái (ví dụ: Đã thanh toán)"
        />
        <SortControls
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          options={sortOptions}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md overflow-x-auto">
        <Table
          columns={columns}
          data={invoices}
          loading={loading}
          onView={handleViewDetails}
          onEdit={handleEdit}
        />
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
      />

      <InvoiceDetailsModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        data={selectedInvoice}
      />

      <UpdateInvoiceModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSave={handleUpdateSave}
        currentData={invoiceToUpdate}
      />
    </div>
  );
};

export default InvoiceManagement;

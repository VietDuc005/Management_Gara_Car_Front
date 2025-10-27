import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../context/ToastContext";
import { invoiceService } from "../services/invoiceService";
import Table from "../components/common/Table";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import InvoiceDetailsModal from "../components/common/InvoiceDetailsModal";
import UpdateInvoiceModal from "../components/common/UpdateInvoiceModal";
import SearchWithOptions from "../components/common/SearchBar";
import BoxOnView from "../components/common/BoxOnView";
import { statisticService } from "../services/statisticService";
import { formatDateTime, formatCurrency } from "../utils/helpers";
import Loading from "../components/common/Loading";

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
  const [overview, setOverview] = useState(null);
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
// ======== GỌI API: TỔNG QUAN ========
  const fetchOverview = useCallback(async () => {
    try {
      const res = await statisticService.getThongKeHoaDon();
      setOverview(res.data || res);
    } catch (err) {
      showToast(err.message || "Lỗi khi tải tổng quan", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchData();
  }, [fetchOverview, fetchData]);

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
        fetchOverview();
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

 const overviewFields = overview
    ? [
        {
          label: "Tổng số hóa đơn",
          value: overview.tongSoHoaDon,
          icon: "package",
          color: "text-orange-500",
          bg: "bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40",
          border: "border-l-4 border-orange-400",
         
        },
        {
          label: "Số hóa đơn đã thanh toán",
          value: overview.soHoaDonDaThanhToan,
          icon: "layers",
          color: "text-sky-500",
          bg: "bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300 dark:from-sky-900/40 dark:via-sky-800/40 dark:to-sky-700/40",
          border: "border-l-4 border-sky-400",
          
        },
        {
          label: "Tổng doanh thu",
          value: overview.tongDoanhThuDaThanhToan,
          icon: "wrench",
          color: "text-emerald-500",
          bg: "bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-900/40 dark:via-emerald-800/40 dark:to-emerald-700/40",
          border: "border-l-4 border-emerald-400",
          
        },
      ]
    : [];

    if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <BoxOnView title="Tổng quan hóa đơn" fields={overviewFields} />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <SearchWithOptions
          searchField={searchField}
          searchTerm={searchTerm}
          onSearchFieldChange={setSearchField}
          onSearchTermChange={setSearchTerm}
          options={searchOptions}
          placeholder="Nhập trạng thái"
          module = "invoice"
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

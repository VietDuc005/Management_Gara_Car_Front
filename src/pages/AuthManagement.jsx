import React, { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import { useToast } from "../context/ToastContext";
import Table from "../components/common/Table";
import SearchWithOptions from "../components/common/SearchBar";
import SortControls from "../components/common/SortControls";
import Pagination from "../components/common/Pagination";
import Box from "../components/common/Box";
import BoxOnView from "../components/common/BoxOnView";
import { Plus, Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/helpers";
import Loading from "../components/common/Loading";

const AuthManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [accounts, setAccounts] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchField, setSearchField] = useState("tenDangNhap");
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 1,
  });

  const [sortConfig, setSortConfig] = useState({
    sortBy: "ngayTao",
    sortDirection: "desc",
  });

  const [selected, setSelected] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [changePwModal, setChangePwModal] = useState(false);

  const isMyAccount = selected?.tenDangNhap === user?.tenDangNhap;

  // Debounce Search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(searchTerm);
      setPagination((p) => ({ ...p, page: 0 }));
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // ========= Fetch Thống kê =========
  const fetchOverview = useCallback(async () => {
    try {
      const res = await authService.getStatistics();
      setOverview(res.data || res);
    } catch (err) {
      console.error("Overview Error:", err);
    }
  }, []);

  // ========= Fetch dữ liệu =========
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { page, size } = pagination;
      const { sortBy, sortDirection } = sortConfig;

      let response;
      if (debounced.trim()) {
        response = await authService.search(
          { [searchField]: debounced },
          page,
          size
        );
      } else {
        response = await authService.getAll(page, size, sortBy, sortDirection);
      }

      const data = response.data || response;
      setAccounts(data.content || []);
      setPagination((p) => ({
        ...p,
        totalPages: data.totalPages || 1,
      }));
    } catch (err) {
      showToast("Tải dữ liệu thất bại!", "error");
    } finally {
      setLoading(false);
    }
  }, [debounced, searchField, pagination.page, pagination.size, sortConfig]);

  useEffect(() => {
    fetchOverview();
    fetchData();
  }, [fetchData, fetchOverview]);

  // ========= Handlers =========
  const onCreateAccount = async (form) => {
    try {
      await authService.register(form);
      showToast("✅ Tạo tài khoản thành công!");
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const onEditAccount = async (form) => {
    try {
      await authService.update(selected.maTaiKhoan, form);
      showToast("✅ Cập nhật tài khoản thành công!");
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleChangePassword = async (form) => {
    try {
      await authService.changePassword(form);
      showToast("✅ Đổi mật khẩu thành công!");
      setChangePwModal(false);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const overviewFields = overview
    ? [
        {
          label: "Tổng tài khoản",
          value: overview.tongSoTaiKhoan,
          icon: "users",
          color: "text-orange-500",
          bg: "bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40",
          border: "border-l-4 border-orange-400",
        },
        {
          label: "Đang hoạt động",
          value: overview.soTaiKhoanHoatDong,
          icon: "user-check",
          color: "text-sky-500",
          bg: "bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300 dark:from-sky-900/40 dark:via-sky-800/40 dark:to-sky-700/40",
          border: "border-l-4 border-sky-400",
        },
        {
          label: "Nhân viên",
          value: overview.soTaiKhoanNhanVien,
          icon: "user-cog",
          color: "text-emerald-500",
          bg: "bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-900/40 dark:via-emerald-800/40 dark:to-emerald-700/40",
          border: "border-l-4 border-emerald-400",
        },
      ]
    : [];

  const columns = [
    { key: "maTaiKhoan", label: "ID" },
    { key: "tenDangNhap", label: "Tên đăng nhập" },
    { key: "email", label: "Email" },
    { key: "vaiTro", label: "Vai trò" },
    {
      key: "trangThai",
      label: "Trạng thái",
      render: (v) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            v === "Hoạt động"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {v}
        </span>
      ),
    },
    { key: "ngayTao", label: "Ngày tạo", render: (v) => formatDate(v) },
  ];

  const searchOptions = [
    { value: "tenDangNhap", label: "Tên đăng nhập" },
    { value: "email", label: "Email" },
    { value: "vaiTro", label: "Vai trò" },
    { value: "trangThai", label: "Trạng thái" },
  ];

  const sortOptions = [
    { value: "ngayTao", label: "Ngày tạo" },
    { value: "tenDangNhap", label: "Tên đăng nhập" },
  ];

  const editFields = [
    { name: "email", label: "Email", type: "text" },
    {
      name: "vaiTro",
      label: "Vai trò",
      type: "select",
      options: ["Quản lý", "Nhân viên"],
    },
    {
      name: "trangThai",
      label: "Trạng thái",
      type: "select",
      options: ["Hoạt động", "Ngừng hoạt động"],
    },
  ];

  const passwordFields = [
    { name: "matKhauCu", label: "Mật khẩu cũ", type: "password", required: true },
    { name: "matKhauMoi", label: "Mật khẩu mới", type: "password", required: true },
  ];
if (loading) return <Loading />;
  return (
    <div className="space-y-6 transition-colors duration-300">
      <BoxOnView title="Thống kê tài khoản" fields={overviewFields} />

      {/* 🔍 Search + Sort + Button */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <SearchWithOptions
          searchField={searchField}
          searchTerm={searchTerm}
          options={searchOptions}
          onSearchFieldChange={setSearchField}
          onSearchTermChange={setSearchTerm}
          placeholder="Nhập nội dung tìm kiếm..."
        />

        <div className="flex gap-3">
          <SortControls
            sortConfig={sortConfig}
            options={sortOptions}
            onSortChange={setSortConfig}
          />
          <button
            onClick={() => {
              setSelected(null);
              setIsEditOpen(true);
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-orange-600 active:scale-95"
          >
            <Plus size={18} /> Tạo tài khoản
          </button>
        </div>
      </div>

      {/* 📄 TABLE */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md overflow-x-auto">
        <Table
          columns={columns}
          data={accounts}
          loading={loading}
          onView={(row) => {
            if (row.tenDangNhap === user.tenDangNhap) {
              setSelected(row);
              setChangePwModal(true);
            } else {
              showToast("⚠️ Bạn chỉ có thể đổi mật khẩu cho tài khoản của chính bạn!", "warning");
            }
          }}
          onEdit={(row) => {
            setSelected(row);
            setIsEditOpen(true);
          }}
          extraIcon={Eye}
        />
      </div>

      {/* 🔄 Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
      />

      {/* 🛠️ Modal Edit / Create */}
      {isEditOpen && (
        <Box
          title={selected ? `Chỉnh sửa: ${selected.tenDangNhap}` : "Tạo tài khoản mới"}
          fields={editFields}
          initialData={selected}
          onClose={() => setIsEditOpen(false)}
          onSubmit={selected ? onEditAccount : onCreateAccount}
        />
      )}

      {/* 🔑 Change Password Modal */}
      {changePwModal && isMyAccount && (
        <Box
          title="Đổi mật khẩu"
          fields={passwordFields}
          onClose={() => setChangePwModal(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
};

export default AuthManagement;

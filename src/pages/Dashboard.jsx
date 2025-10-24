import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BoxOnView from "../components/common/BoxOnView";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";
import { statisticService } from "../services/statisticService";

// Màu cho biểu đồ
const COLORS = [
  "#fb923c",
  "#10b981",
  "#06b6d4",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
];


const Dashboard = () => {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Năm");

  // ======== GỌI API: TỔNG QUAN ========
  const fetchOverview = useCallback(async () => {
    try {
      const res = await statisticService.getOverview();
      setOverview(res.data || res);
    } catch (err) {
      console.error("❌ Lỗi khi tải tổng quan:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ======== GỌI API: DOANH THU ========
  const fetchRevenue = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      let res;

      if (activeTab === "Tuần") {
        res = await statisticService.getDoanhthutuan(today);
      } else if (activeTab === "Tháng") {
        const thang = new Date().getMonth() + 1;
        const nam = new Date().getFullYear();
        res = await statisticService.getDoanhthuthang(thang, nam);
      } else if (activeTab === "Năm") {
        const nam = new Date().getFullYear();
        res = await statisticService.getDoanhthunam(nam);
      }

      const data = res?.data?.data || res?.data || {};

      // 🔹 Ưu tiên chọn đúng trường chi tiết theo loại
      const raw =
        data.chiTietTheoNgay ||
        data.chiTietTheoTuan ||
        data.chiTietTheoQuy ||
        {};

      // 🔹 Map về mảng [{ name, value }]
      const mapped = Object.entries(raw).map(([key, val]) => ({
        name: key,
        value: val,
      }));

      setRevenueData(mapped);
    } catch (err) {
      console.error("❌ Lỗi tải biểu đồ doanh thu:", err);
    }
  }, [activeTab]);

  // ======== GỌI API: TỶ LỆ SỬ DỤNG DỊCH VỤ ========
  const fetchUsageRate = useCallback(async () => {
    try {
      const res = await statisticService.getTilesudung();
      const raw = res.data?.data || res.data || [];

      const mapped = raw.map((item) => ({
        name: item.tenLoaiDichVu,
        value: parseFloat(item.tiLeSuDung.toFixed(2)),
        count: item.soLanSuDung,
      }));

      setUsageData(mapped);
    } catch (err) {
      console.error("❌ Lỗi tải tỷ lệ sử dụng dịch vụ:", err);
      setUsageData([]);
    }
  }, []);

  // ======== useEffect ========
  useEffect(() => {
    fetchOverview();
    fetchUsageRate();
  }, [fetchOverview, fetchUsageRate]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // ======== BOX THỐNG KÊ ========
  const overviewFields = overview
    ? [
        {
          label: "Tổng số Dịch vụ",
          value: overview.tongSoDichVu,
          icon: "package",
          color: "text-orange-500",
          bg: "bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40",
          border: "border-l-4 border-orange-400",
          link : "/services",
        },
        {
          label: "Tổng số Lượng tồn",
          value: overview.tongSoLuongTon,
          icon: "layers",
          color: "text-sky-500",
          bg: "bg-gradient-to-r from-sky-100 via-sky-200 to-sky-300 dark:from-sky-900/40 dark:via-sky-800/40 dark:to-sky-700/40",
          border: "border-l-4 border-sky-400",
          link: "/services",

        },
        {
          label: "Tổng số Thợ",
          value: overview.tongSoTho,
          icon: "wrench",
          color: "text-emerald-500",
          bg: "bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-900/40 dark:via-emerald-800/40 dark:to-emerald-700/40",
          border: "border-l-4 border-emerald-400",
          link :"/machine",
        },
        {
          label: "Tổng số Loại dịch vụ",
          value: overview.tongSoLoaiDichVu,
          icon: "shopping-bag",
          color: "text-violet-500",
          bg: "bg-gradient-to-r from-violet-100 via-violet-200 to-violet-300 dark:from-violet-900/40 dark:via-violet-800/40 dark:to-violet-700/40",
          border: "border-l-4 border-violet-400",
          link:"/service-types",
        },
        {
          label: "Tổng số Khách hàng",
          value: overview.tongSoKhachHang,
          icon: "users",
          color: "text-rose-500",
          bg: "bg-gradient-to-r from-rose-100 via-rose-200 to-rose-300 dark:from-rose-900/40 dark:via-rose-800/40 dark:to-rose-700/40",
          border: "border-l-4 border-rose-400",
          link: "/customers",
        },
        {
          label: "Hóa đơn đã thanh toán",
          value: overview.tongSoHoaDonDaThanhToan,
          icon: "file-text",
          color: "text-amber-500",
          bg: "bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 dark:from-amber-900/40 dark:via-amber-800/40 dark:to-amber-700/40",
          border: "border-l-4 border-amber-400",
          link: "/invoice",
        },
      ]
    : [];

  // ======== HIỂN THỊ UI ========
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="space-y-8 transition-colors duration-300">
      {/* BOX TỔNG QUAN */}
      <BoxOnView title="Tổng quan hệ thống" fields={overviewFields} />

      {/* 2 BIỂU ĐỒ SONG SONG */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ===== BIỂU ĐỒ DOANH THU ===== */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Thống kê Doanh thu
            </h3>
            <div className="flex space-x-2">
              {["Tuần", "Tháng", "Năm"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md border text-sm font-medium ${
                    activeTab === tab
                      ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                      : "bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[340px]">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}tr`}
                    stroke="#888"
                  />
                  <Tooltip
                    formatter={(v) => `${(v / 1_000_000).toFixed(1)} triệu`}
                    contentStyle={{
                      background: "#fff",
                      borderRadius: "8px",
                      borderColor: "#ccc",
                    }}
                  />
                  <Bar dataKey="value" fill="#fb923c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                Không có dữ liệu doanh thu.
              </div>
            )}
          </div>
        </div>

        {/* ===== BIỂU ĐỒ TỶ LỆ ===== */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Tỷ lệ sử dụng dịch vụ
            </h3>
          </div>

          <div className="h-[340px]">
            {usageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {usageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                    <Label
                      value={`Tổng: ${usageData.reduce(
                        (sum, i) => sum + i.count,
                        0
                      )} lượt`}
                      position="center"
                      fill="#666"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    />
                  </Pie>

                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value.toFixed(2)}% (${props.payload.count} lần)`,
                      name,
                    ]}
                    contentStyle={{
                      background: "#fff",
                      borderRadius: "8px",
                      borderColor: "#ccc",
                      color: "#111",
                    }}
                  />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                Không có dữ liệu sử dụng dịch vụ.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState, useCallback } from "react";
import BoxOnView from "../components/common/BoxOnView";
import Loading from "../components/common/Loading";
import { useToast } from "../context/ToastContext";

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
  
const { showToast } = useToast();

  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
const [topServices, setTopServices] = useState([]);

  // Bộ lọc doanh thu
  const [activeTab, setActiveTab] = useState("Năm");
  const [selectedDate, setSelectedDate] = useState(""); // Tuần (yyyy-mm-dd)
  const [selectedMonth, setSelectedMonth] = useState(""); // Tháng
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm

  // ======== GỌI API: TỔNG QUAN ========
  const fetchOverview = useCallback(async () => {
    try {
      const res = await statisticService.getOverview();
      setOverview(res.data || res);
    } catch (err) {
      showToast(err.message || "Lỗi khi tải tổng quan", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ======== GỌI API: DOANH THU ========
  const fetchRevenue = useCallback(async () => {
    try {
      setLoading(true);
      let res;

      if (activeTab === "Tuần") {
        if (!selectedDate) return showToast("Vui lòng chọn ngày (yyyy-mm-dd)");
        res = await statisticService.getDoanhthutuan(selectedDate);
      } else if (activeTab === "Tháng") {
        if (!selectedMonth || !selectedYear)
          return showToast("Vui lòng nhập tháng và năm!");
        res = await statisticService.getDoanhthuthang(selectedMonth, selectedYear);
      } else if (activeTab === "Năm") {
        if (!selectedYear) return showToast("Vui lòng nhập năm!");
        res = await statisticService.getDoanhthunam(selectedYear);
      }

      const data = res?.data?.data || res?.data || {};
      const raw =
        data.chiTietTheoNgay ||
        data.chiTietTheoTuan ||
        data.chiTietTheoQuy ||
        {};

      const mapped = Object.entries(raw).map(([key, val]) => ({
        name: key,
        value: val,
      }));

      setRevenueData(mapped);
    } catch (err) {
      console.error("❌ Lỗi tải biểu đồ doanh thu:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDate, selectedMonth, selectedYear]);

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
  // ======== GỌI API: TOP 5 DỊCH VỤ ========
const fetchTopServices = useCallback(async () => {
  try {
    const res = await statisticService.getTopDichVu();
    const raw = res?.data?.data || res?.data || [];

    const mapped = raw.map((item, index) => ({
      id: index + 1,
      tenDichVu: item.tenDichVu,
      soLuongSuDung: item.soLuongSuDung,
      doanhThu: item.doanhThu,
    }));

    setTopServices(mapped);
  } catch (err) {
    showToast("Không thể tải Top dịch vụ!", "error");
  }
}, [showToast]);


  // ======== useEffect ========
 useEffect(() => {
  fetchOverview();
  fetchUsageRate();
  fetchTopServices();
}, [fetchOverview, fetchUsageRate, fetchTopServices]);


 // ✅ Load doanh thu năm ngay khi vào Dashboard
useEffect(() => {
  if (activeTab === "Năm") fetchRevenue();
}, [fetchRevenue, activeTab]);

  // ======== BOX TỔNG QUAN ========
  const overviewFields = overview
    ? [
        {
          label: "Tổng số Dịch vụ",
          value: overview.tongSoDichVu,
          icon: "package",
          color: "text-orange-500",
          bg: "bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 dark:from-orange-900/40 dark:via-orange-800/40 dark:to-orange-700/40",
          border: "border-l-4 border-orange-400",
          link: "/services",
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
          link: "/machine",
        },
        {
          label: "Tổng số Loại dịch vụ",
          value: overview.tongSoLoaiDichVu,
          icon: "shopping-bag",
          color: "text-violet-500",
          bg: "bg-gradient-to-r from-violet-100 via-violet-200 to-violet-300 dark:from-violet-900/40 dark:via-violet-800/40 dark:to-violet-700/40",
          border: "border-l-4 border-violet-400",
          link: "/service-types",
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
 if (loading) return <Loading />;

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

            <div className="flex items-center gap-3">
              {/* Tab chọn chế độ: Tuần / Tháng / Năm */}
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2 
                          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="Tuần">Tuần</option>
                <option value="Tháng">Tháng</option>
                <option value="Năm">Năm</option>
              </select>

              {/* Input thay đổi theo lựa chọn */}
              {activeTab === "Tuần" && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2
                            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                />
              )}

              {activeTab === "Tháng" && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="Tháng"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value) || "")}
                    className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2
                              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                  />
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    placeholder="Năm"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value) || "")}
                    className="w-24 border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2
                              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                  />
                </div>
              )}

              {activeTab === "Năm" && (
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  placeholder="Năm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value) || "")}
                  className="w-24 border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2
                            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                />
              )}

              <button
                onClick={fetchRevenue}
                className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
              >
                Lọc
              </button>
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
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Tỷ lệ sử dụng dịch vụ
          </h3>
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
    {/* ===== BẢNG TOP 5 DỊCH VỤ (NEW DESIGN) ===== */}
<div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md transition-colors duration-300">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
    Top 5 dịch vụ được sử dụng nhiều nhất
  </h3>

  <div className="space-y-3">
    {topServices.slice(0, 5).map((item, index) => {
      const rank = index + 1;

      const rankStyle = {
        1: "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900",
        2: "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900",
        3: "bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100",
      };

      const medals = {
        1: "🥇",
        2: "🥈",
        3: "🥉",
      };

      return (
        <div
          key={index}
          className="flex justify-between items-center p-4 rounded-lg 
            border dark:border-gray-700 shadow-sm hover:shadow-md 
            transition cursor-pointer hover:scale-[1.01]"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
                ${rank <= 3 ? rankStyle[rank] : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}
              `}
            >
              {rank <= 3 ? medals[rank] : rank}
            </span>

            <span className="font-medium text-gray-700 dark:text-gray-200">
              {item.tenDichVu}
            </span>
          </div>

          {/* Right */}
          <span className="text-sm font-semibold text-orange-600">
            {item.soLuongSuDung} lần
          </span>
        </div>
      );
    })}
  </div>
</div>


    </div>
    
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate
import { useCart } from "../context/CartContext"; // ✅ 2. Import useCart
import OrderSidebar from "../components/layout/OrderSidebar";
import ProductCard from "../components/common/ProductCard";
import { Search } from "lucide-react";
import { serviceService } from "../services/serviceService";
import { serviceTypeService } from "../services/serviceTypeService";
import { formatCurrency } from "../utils/helpers";

const SalesManagement = () => {
  const navigate = useNavigate(); // ✅ 3. Khởi tạo navigate
  const { addToCart } = useCart(); // ✅ 4. Lấy hàm addToCart từ context
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ❌ 5. Xóa state giỏ hàng cục bộ: const [cart, setCart] = useState([]);

  // Lấy danh sách Loại dịch vụ
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serviceTypeService.getAll(0, 100);
        if (response?.content) {
          const categoryNames = response.content.map((c) => c.tenLoai);
          setCategories(["Tất cả", ...categoryNames]);
        }
      } catch (err) {
        console.error("❌ Lỗi tải loại dịch vụ:", err);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách Dịch vụ (Sản phẩm)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getAll(0, 1000); // Lấy nhiều để lọc client-side
        const list = response?.content || [];

        const mapped = list.map((item) => ({
          id: item.maDichVu,
          name: item.tenDichVu,
          category: item.tenLoaiDichVu,
          price: item.gia,
          soLuongBan: item.soLuongBan, // ✅ THÊM SỐ LƯỢNG BÁN
          moTa: item.moTa,
          soLuongTon: item.soLuongTon,
          image: item.anhDichVuUrl, // Sử dụng Url
          status: item.trangThai,
          time: item.thoiGianUocTinh,
          // Thêm các trường khác từ API nếu cần cho trang chi tiết
          moTa: item.moTa,
          // ...
        }));

        setServices(mapped);
        setError("");
      } catch (err) {
        console.error("❌ Lỗi tải danh sách dịch vụ:", err);
        setError("Không thể tải danh sách dịch vụ từ server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ❌ 6. Xóa các hàm xử lý giỏ hàng cục bộ: handleAddToCart, handleRemove, handleCheckout

  // ✅ 7. Cập nhật hàm xem chi tiết để điều hướng và truyền dữ liệu
  const handleViewDetails = (product) => {
    // Truyền dữ liệu qua `state` của navigate
    navigate(`/sales/services/${product.id}`, {
      state: { productData: product },
    });
  };

  // LOGIC LỌC DỮ LIỆU
  const filteredServices = services.filter((s) => {
    const isAvailable = s.status === "Còn hàng"; // Chỉ lấy "Còn hàng"
    const matchCategory =
      selectedCategory === "Tất cả" || s.category === selectedCategory;
    const matchSearch = (s.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return isAvailable && matchCategory && matchSearch;
  });

  return (
    // Thêm h-screen và overflow-hidden để layout chiếm toàn màn hình và không bị cuộn
    <div className="flex h-screen overflow-hidden">
      {/* KHU VỰC SẢN PHẨM */}
      {/* Thêm flex flex-col để các phần tử con sắp xếp theo chiều dọc */}
      <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 flex flex-col">
        {/* Thanh tìm kiếm & lọc */}
        {/* Thêm dark mode classes */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border dark:border-gray-700 mb-6">
          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên dịch vụ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" // Thêm màu nền, text cho dark mode
            />
          </div>

          {/* Danh mục lọc */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/30" // Thêm dark mode classes
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Lưới sản phẩm (có thể cuộn) */}
        {/* Thêm flex-1 và overflow-y-auto để phần này tự co giãn và cuộn được */}
        <div className="flex-1 overflow-y-auto pr-2">
          {" "}
          {/* Thêm pr-2 để tránh thanh cuộn che nội dung */}
          {loading ? (
            
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-100"></div>
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-200"></div>
    </div>

    <p className="mt-4 text-gray-600 dark:text-gray-300 font-semibold tracking-wide">
      Garage Manager đang tải dữ liệu...
    </p>
  </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredServices.length > 0 ? (
                filteredServices.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={{ ...item, priceText: formatCurrency(item.price) }}
                    onAddToCart={addToCart} // ✅ 8. Dùng hàm từ context
                    onViewDetails={handleViewDetails} // ✅ 9. Dùng hàm điều hướng mới
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center col-span-full py-10">
                  Không tìm thấy dịch vụ nào phù hợp.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR ĐƠN HÀNG - Không cần truyền props nữa vì dùng context */}
      <OrderSidebar />
    </div>
  );
};

export default SalesManagement;

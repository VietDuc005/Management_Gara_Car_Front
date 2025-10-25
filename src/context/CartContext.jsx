import React, { createContext, useState, useContext } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showToast } = useToast();

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, { ...product, qty: 1 }];
    });
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  /**
   * ✅ HÀM MỚI: Tăng số lượng sản phẩm trong giỏ
   * @param {number|string} productId - ID sản phẩm
   */
  const increaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  /**
   * ✅ HÀM MỚI: Giảm số lượng sản phẩm trong giỏ
   * @param {number|string} productId - ID sản phẩm
   */
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, qty: Math.max(1, item.qty - 1) } : item // Đảm bảo số lượng không dưới 1
      ).filter(item => item.qty > 0) // Có thể tùy chọn xóa nếu số lượng về 0
    );
  };

  const clearCart = () => {
      setCartItems([]);
      // showToast("Đã xóa toàn bộ giỏ hàng.", "info"); // Có thể bỏ thông báo này nếu không cần
  };

  // ✅ Thêm hàm mới vào value
  const value = { cartItems, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


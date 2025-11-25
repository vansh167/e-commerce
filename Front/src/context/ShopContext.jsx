import React, { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext(null);

// Utility: Create default empty cart
const getDefaultCart = () => {
  const cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  return cart;
};

const ShopContexProvider = ({ children }) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  const BASE_URL = "https://backend-om60.onrender.com";

  // Fetch products and cart on first load
  useEffect(() => {
    fetch(`${BASE_URL}/allproducts`)
      .then((res) => res.json())
      .then((data) => setAll_Product(data))
      .catch((err) => console.error("Error fetching products:", err));

    if (localStorage.getItem("auth-token")) {
      fetch(`${BASE_URL}/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: "",
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data))
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, []);

  // Add item to cart
  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    if (localStorage.getItem("auth-token")) {
      fetch(`${BASE_URL}/addtocart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ itemId }),
      }).catch((err) => console.error("Error adding to cart:", err));
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (localStorage.getItem("auth-token")) {
      fetch(`${BASE_URL}/removefromcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ itemId }),
      }).catch((err) => console.error("Error removing from cart:", err));
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems(getDefaultCart());
    localStorage.removeItem("cart-items");

    if (localStorage.getItem("auth-token")) {
      fetch(`${BASE_URL}/clearcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: "",
      }).catch((err) => console.error("Error clearing cart:", err));
    }
  };

  // Total cart amount
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = all_product.find((p) => p.id === Number(itemId));
        if (product) {
          total += product.new_price * cartItems[itemId];
        }
      }
    }
    return total;
  };

  // Total item count
  const getTotalCartItem = () => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
  };

  // Provide values
  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getTotalCartItem,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

const useShopContext = () => useContext(ShopContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ShopContexProvider, useShopContext };

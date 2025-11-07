import React, { useState, useEffect } from "react";
import { useShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { getTotalCartAmount } = useShopContext();
  const totalAmount = getTotalCartAmount();
  const navigate = useNavigate();

  const [address, setAddress] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    const savedAddress = localStorage.getItem("user-address");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddress(formData);
    localStorage.setItem("user-address", JSON.stringify(formData));
    setFormVisible(false);
  };

  const handlePlaceOrder = () => {
    if (!address) {
      alert("⚠️ Please add a delivery address first.");
      return;
    }

    const orderId = Date.now();
    const orderDetails = {
      id: orderId,
      address,
      totalAmount,
      deliveryType: "Standard Delivery", // or "Today Delivery"
      orderDate: new Date().toISOString(),
      status: "Order Placed",
    };

    const existingOrders = JSON.parse(localStorage.getItem("customer-orders")) || [];
    localStorage.setItem("customer-orders", JSON.stringify([...existingOrders, orderDetails]));

    navigate("/payment", { state: { address, totalAmount, orderId } });
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-heading">Checkout</h2>

      <div className="checkout-sections">
        {/* Left Section (Address Form) */}
        <div className="checkout-left-section">
          {!address && !formVisible && (
            <button className="add-address-btn" onClick={() => setFormVisible(true)}>
              + Add Address
            </button>
          )}

          {formVisible && (
            <form onSubmit={handleSubmit} className="address-form">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
              <button type="submit" className="save-address-btn">Save Address</button>
            </form>
          )}
        </div>

        {/* Right Section (Saved Address + Summary) */}
        <div className="checkout-right-section">
          {address ? (
            <div className="saved-address-box">
              <h3>Delivery Address</h3>
              <p><b>Name:</b> {address.name}</p>
              <p><b>Phone:</b> {address.phone}</p>
              <p><b>Address:</b> {address.address}</p>
              <p><b>City:</b> {address.city}</p>
              <p><b>Pincode:</b> {address.pincode}</p>

              <button
                className="edit-address-btn"
                onClick={() => {
                  setFormData(address);
                  setFormVisible(true);
                }}
              >
                Change
              </button>

              <div className="order-summary-box">
                <p className="order-total">
                  Total Amount: <span>₹{totalAmount}</span>
                </p>
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                  Place Order
                </button>
              </div>
            </div>
          ) : (
            <p className="no-address-text">No address saved yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

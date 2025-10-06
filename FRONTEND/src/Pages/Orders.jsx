import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading orders...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: "1px solid #eee", margin: "16px 0", padding: 16, borderRadius: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Total:</strong> ₹{(order.finalAmount ?? order.totalAmount)?.toFixed(2)}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Status:</strong> {order.status}
            </div>
            <div>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed #ddd" }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;

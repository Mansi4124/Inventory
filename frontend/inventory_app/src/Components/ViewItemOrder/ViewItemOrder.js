import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility function to get the value of a cookie by name
const getCookie = (cookieName) => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

const ViewItemOrder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch userId from cookies
    const userId = getCookie("userId"); // Assuming the cookie name is 'userId'

    if (!userId) {
      setError("User ID not found in cookies");
      return;
    }

    // Fetch orders from the backend
    axios
      .get(`http://localhost:8000/get_item_order?user_id=${userId}`)
      .then((response) => {
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError("No orders found for this user");
        }
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error fetching orders");
      });
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h2>Order Records</h2>
      {orders.length === 0 ? (
        <p>No order data available</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
                
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.order_id || `Order ${index + 1}`}</td>
                  <td>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.total}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewItemOrder;

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

const ViewSales = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch userId from cookies
    const userId = getCookie("userId"); // Assuming the cookie name is 'userId'

    if (!userId) {
      setError("User ID not found in cookies");
      return;
    }

    // Fetch sales from the backend
    axios
      .get(`http://localhost:8000/get_sales_view?user_id=${userId}`)
      .then((response) => {
        const sortedSales = response.data.sales.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ); // Sort by date (most recent first)
        setSales(sortedSales);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error fetching sales data");
      });
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h2>Sales Records</h2>
      {sales.length === 0 ? (
        <p>No sales data available</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Customer Email</th>
                <th>Items</th>
                <th>Sub Total</th>
                <th>GST</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.customer_name}</td>
                  <td>{sale.customer_email || "N/A"}</td>
                  <td>
                    <ul>
                      {sale.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{sale.sub_total}</td>
                  <td>{sale.gst}</td>
                  <td>{sale.discount}</td>
                  <td>{sale.total}</td>
                  <td>{new Date(sale.date).toLocaleDateString()}</td> {/* Format the date */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewSales;

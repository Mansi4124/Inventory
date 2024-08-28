import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream
import "./HomeContent.css";
=======
import "../HomeContent/HomeContent.css";
>>>>>>> Stashed changes
import axios from "axios"
import { useNavigate } from "react-router-dom";

const HomeContent = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getCookie = (name) => {
      const cookieName = `${name}=`;
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
          return cookie.substring(cookieName.length, cookie.length);
        }
      }
      return null;
    };


    const fetchData = async () => {
      const userId = getCookie('userId');
      if (userId) {
        try {
          const response = await axios.post("http://localhost:8000/get_customer_data/", { user_id: userId });
          if (response.data.user) {
            setData(response.data.user);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setData(null);
          navigate("/sign_in")
        }
      } else {
        setData(null);
        navigate("/sign_in")
      }
      setLoading(false);
    };

    fetchData();

  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="main-div">
      <div className="content-div">
        <h2 className="title">Hello, {data['fname']} </h2>
        <p className="text-muted">Organization Name</p>
      </div>

      <div className="home-content">
        {/* Inventory Summary */}
        <div className="card inventory-summary">
          <div className="bgdiv">
            <h2 className="home-title">Inventory Summary</h2>
          </div>
          <div className="bgp">
            <p>
              Quantity in Hand: <span>0</span>
            </p>
            <p>
              Quantity to be Received: <span>0</span>
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="card product-details">
          <div className="bgdiv">
            <h2 className="home-title">Product Details</h2>
          </div>
          <div className="bgp">
            <p>
              Low Stock Items: <span>0</span>
            </p>
            <p>
              All Items: <span>0</span>
            </p>
            <p>
              All Item Groups: <span>0</span>
            </p>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="card top-selling-items">
          <div className="bgdiv">
            <h2 className="home-title">Top Selling Items</h2>
          </div>
          <div className="bgp">
            <select className="">
              <option value="this-day">This Day</option>
              <option value="this-month">This Month</option>
              <option value="this-two-months">This Two Months</option>
            </select>
            {/* Display relevant content based on the selected option */}
            <p>
              Top Item: <span>Product A</span>
            </p>
            <p>
              Quantity Sold: <span>0</span>
            </p>
          </div>
        </div>

        {/* Purchase Order */}
        <div className="card purchase-order">
          <div className="bgdiv">
            <h2 className="home-title">Purchase Order</h2>
          </div>
          <div className="bgp">
            <select>
              <option value="this-month">This Month</option>
              <option value="all">All</option>
            </select>
            {/* Display relevant content based on the selected option */}
            <p>
              Quantity Ordered: <span>0</span>
            </p>
            <p>
              Total Cost: <span>0</span>
            </p>
          </div>
        </div>

        {/* Sales Order Summary Graph */}
        <div className="sales-order-summary">
          <div className="graph-title">
            <h2 className="home-title">Sales Order Summary</h2>
          </div>
          <div className="graph-placeholder">
            {/* Placeholder for the graph, can be replaced with actual graph later */}
            <p>Graph will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;

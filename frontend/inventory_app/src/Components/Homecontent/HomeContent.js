import React, { useEffect, useState } from "react";
import "./HomeContent.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const HomeContent = () => {

  const [loading, setLoading] = useState(true);
  const [availableQuantity, setAvialableQuantity] = useState(0);
  const [soldQuantity, setSoldQuantity] = useState(0);
  const [boughtQuantity, setBoughtQuantity] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [individualItems, setIndividualItems] = useState(0);
  const [groupItems, setGroupItems] = useState(0);
  const [maxSale, setMaxSale] = useState(0);
  const [maxSaleItem, setMaxSaleItem] = useState(0);
  const [leastSale, setLeastSale] = useState(0);
  const [leastSaleItem, setLeastSaleItem] = useState(0);
  const [orgData, setOrgData] = useState({ orgName: "" });
  const navigate = useNavigate()

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

  useEffect(() => {

    const fetchData = async () => {
      const userId = getCookie('userId');
      if (userId) {
        const res = await axios.post("http://localhost:8000/get_organization_data/", { "user_id": userId });
        if (res.data.success) {
          setOrgData(res.data.org);

          const res1 = await axios.post("http://localhost:8000/get_items/", { "user_id": userId });
          if (res1.data.success) {
            const user_items = res1.data.user_items.products;
            const user_normal_items = user_items.filter((item) => item['category'] !== "Composite");

            let available_quantity = 0;
            let sold_quantity = 0;
            let bought_quantity = 0;
            let low_stock_items_count = 0;
            let max_sales = 0
            let least_sales = Number.MAX_SAFE_INTEGER
            let max_sales_item = ""
            let least_sales_item = ""

            for (var item of user_normal_items) {
              available_quantity += item.remaining_stock;
              sold_quantity += item.sold_quantity;
              bought_quantity += item.bought_quantity;
              if (item.remaining_stock < 20) {
                low_stock_items_count += 1;
              }
              if(item.sold_quantity>max_sales){
                max_sales=item.sold_quantity
                max_sales_item=item.product_name
              }
              if(item.sold_quantity < least_sales){
                least_sales=item.sold_quantity
                least_sales_item=item.product_name
              }
            }

            setAvialableQuantity(available_quantity);
            setSoldQuantity(sold_quantity);
            setBoughtQuantity(bought_quantity);
            setLowStock(low_stock_items_count);
            setIndividualItems(user_normal_items.length);
            setGroupItems(user_items.length - user_normal_items.length);
            setMaxSale(max_sales)
            setLeastSale(least_sales)
            setMaxSaleItem(max_sales_item)
            setLeastSaleItem(least_sales_item)
        }
      } else {
        navigate("/add-organization");
      }
    }
    setLoading(false);
  };
  fetchData();
}, []);

if (loading) {
  return <div>Loading...</div>;
}

return (
  <div className="main-div">


    <div className="home-content">
      {/* Inventory Summary */}
      <div className="card inventory-summary">
        <div className="bgdiv">
          <h2 className="home-title">Inventory Summary</h2>
        </div>
        <div className="bgp">
          <p>
            Quantity in Hand: <span>{availableQuantity}</span>
          </p>
          <p>
            Quantity sold: <span>{soldQuantity}</span>
          </p>
          <p>
            Quantity bought: <span>{boughtQuantity}</span>
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
            Low Stock Items: <span>{lowStock}</span>
          </p>
          <p>
            All Individual Items: <span>{individualItems}</span>
          </p>
          <p>
            All Item Groups: <span>{groupItems}</span>
          </p>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="card top-selling-items">
        <div className="bgdiv">
          <h2 className="home-title">Top Selling Item</h2>
        </div>
        <div className="bgp">
          {/* Display relevant content based on the selected option */}
          <p>
            Top Item: <span>{maxSaleItem}</span>
          </p>
          <p>
            Quantity Sold: <span>{maxSale}</span>
          </p>
        </div>
      </div>

      {/* Purchase Order */}
      <div className="card purchase-order">
        <div className="bgdiv">
          <h2 className="home-title">Least Selling Item</h2>
        </div>
        <div className="bgp">
          {/* Display relevant content based on the selected option */}
          <p>
            Least Sold Item : <span>{leastSaleItem}</span>
          </p>
          <p>
            Quantity Sold : <span>{leastSale}</span>
          </p>
        </div>
      </div>

      {/* Sales Order Summary Graph */}
      {/* <div className="sales-order-summary">
          <div className="graph-title">
            <h2 className="home-title">Sales Order Summary</h2>
          </div>
          <div className="graph-placeholder">
            <p>Graph will be displayed here</p>
          </div>
        </div> */}
    </div>
  </div>
);
};

export default HomeContent;

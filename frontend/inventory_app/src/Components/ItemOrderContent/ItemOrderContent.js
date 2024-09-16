import React from "react";
import "../ItemOrderContent/ItemOrderContent.css"; // Import custom CSS for styling
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import i1 from '../../assets/i5.jpg'; // Image for Add Item Orders
import i2 from '../../assets/i6.jpg'; // Image for View Item Orders

const ItemOrderContent = () => {
  const navigate = useNavigate();

  return (
    <div className="main-div3">
      <div className="content-divv1">
        <p className="text-muted">Manage your item orders efficiently</p>
      </div>

      <div className="itemorder-content">
        {/* Add Item Orders Card */}
        <div className="card itemorder-card">
          <div className="backgrounddivv1">
            <img src={i1} className="i1" alt="Add Item Orders"/>
            <h2>Add Item Orders</h2>
          </div>
          <div className="">
            <i className="bi bi-plus-circle" style={{ fontSize: "2rem" }}></i>
            <p className="ptitle">Click the button below to add new item orders.</p>
            <Button className="itemorder-btn" onClick={() => navigate("/item-orders")}>
              Add Item Orders
            </Button>
          </div>
        </div>

        {/* View Item Orders Card */}
        <div className="card itemorder-card">
          <div className="backgrounddivv1">
            <img src={i2} className="i2" alt="View Item Orders"/>
            <h2>View Item Orders</h2>
          </div>
          <div className="">
            <i className="bi bi-eye" style={{ fontSize: "2rem" }}></i>
            <p className="ptitle">Click the button below to view your item order data.</p>
            <Button className="itemorder-btn" onClick={() => navigate("/view-item-orders")}>
              View Item Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemOrderContent;

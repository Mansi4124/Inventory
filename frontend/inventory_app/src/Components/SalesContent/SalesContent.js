import React from "react";
import "../SalesContent/SalesContent.css"; // Import custom CSS for styling
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import s1 from '../../assets/i4.jpg';
import s2 from '../../assets/i6.jpg';

const SalesContent = () => {
  const navigate = useNavigate();

  return (
    <div className="main-div2">
      <div className="content-divv">
        <p className="text-muted">Manage your sales efficiently</p>
      </div>

      <div className="sales-content">
        {/* Add Sales Card */}
        <div className="card sales-card">
          <div className="backgrounddivv">
            <img src={s1} className="s1" alt="Add Sales"/>
            <h2>Add Sales</h2>
          </div>
          <div className="">
            <i className="bi bi-plus-circle" style={{ fontSize: "2rem" }}></i>
            <p className="ptitle">Click the button below to add new sales.</p>
            <Button className="sales-btn" onClick={() => navigate("/sales-order")}>
              Add Sales
            </Button>
          </div>
        </div>

        {/* View Sales Card */}
        <div className="card sales-card">
          <div className="backgrounddivv">
            <img src={s2} className="s2" alt="View Sales"/>
            <h2>View Sales</h2>
          </div>
          <div className="">
            <i className="bi bi-eye" style={{ fontSize: "2rem" }}></i>
            <p className="ptitle">Click the button below to view your sales data.</p>
            <Button className="sales-btn" onClick={() => navigate("/view-sales")}>
              View Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesContent;

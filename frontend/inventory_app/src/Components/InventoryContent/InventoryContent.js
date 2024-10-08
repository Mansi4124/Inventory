import React from "react";
import "../InventoryContent/InventoryContent.css"; // Import custom CSS for styling
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import i1 from '../../assets/i1.jpg'
import i2 from '../../assets/i2.jpg'
import i3 from '../../assets/i3.jpg'
const InventoryContent = () => {
  const navigate = useNavigate();
  
  return (
    <div className="main-div1">
      <div className="content-div">
       
        <p className="text-muted ">Manage your inventory efficiently</p>
      </div>

      <div className="inventory-content">
        {/* Add Item Card */}
        <div className="card inventory-card">
          <div className="backgrounddiv">
          <img src={i2} className="i2"/>
            <h2>Add Item</h2>
          </div>
          <div className="">
        
            <i className="bi bi-plus-circle" style={{ fontSize: "2rem" }}></i>
            <p>Click the button below to add a new item.</p>
            <Button className="inv-btn" onClick={() => navigate("/itemform")}>
              Add Item
            </Button>
          </div>
        </div>

        {/* Add Composite Item Card */}
        <div className="card inventory-card">
          <div className="backgrounddiv">
          <img src={i1}/>
            <h2>Add Composite Item</h2>
          </div>
          <div className="">
           
            <i className="bi bi-box-seam" style={{ fontSize: "2rem" }}></i>
            <p>Click the button below to add a composite item.</p>
            <Button className="inv-btn" onClick={() => navigate("/compositeform")}>
              Add Composite Item
            </Button>
          </div>
        </div>

        {/* View Low Stock Item Card */}
        <div className="card inventory-card">
          <div className="backgrounddiv">
          <img src={i3}/>
            <h2>Manage Items</h2>
          </div>
          <div className="">
            <i className="bi bi-box-seam" style={{ fontSize: "2rem" }}></i>
            <p>Click the button below to manage your items.</p>
            <Button className="inv-btn" onClick={() => navigate("/manage-item-form")}>
              Manage Items
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InventoryContent;

import React from 'react';
import './Features.css'; // Assuming you have a CSS file for styles

const Features = () => {
  return (
    <section id="features" className="features">
      <div className="features-container">
        <div className="feature">
          <div className="feature-icon">
            <img src="OrderIcon.png" alt="Order Management Icon" />
            <h2>Order Management</h2>
          </div>
          <div className="feature-text">
            <p>
              Handle all your sales and purchases activities, manage invoices and bills, and track payments. Our Inventory will help you to track everything.
            </p>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <img src="analysis.png" alt="Reports Icon" />
            <h2>Reports</h2>
          </div>
          <div className="feature-text">
            <p>
              Know your inventory aging, vendor payments, sales details, and inventory valuation from a range of reports that can be generated, downloaded, and shared easily.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

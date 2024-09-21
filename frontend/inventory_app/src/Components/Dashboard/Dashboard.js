import React, { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import "../Dashboard/Dashboard.css";
import HomeContent from "../Homecontent/HomeContent";
import InventoryContent from "../InventoryContent/InventoryContent";
import Reports from "../Reports/Reports";
import SalesContent from "../SalesContent/SalesContent";
import ItemOrderContent from "../ItemOrderContent/ItemOrderContent";
import PredictItems from '../PredictItems/PredictItems';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState({ orgName: "" });

  useEffect(() => {
    const getCookie = (name) => {
      const cookieName = `${name}=`;
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(";");

      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName)) {
          return cookie.substring(cookieName.length);
        }
      }
      return null;
    };

    const user = getCookie("userId");
    if (!user) {
      navigate("/sign_in");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = getCookie("userId");
      if (userId) {
        try {
          const [userResponse, orgResponse] = await Promise.all([
            axios.post("http://localhost:8000/get_customer_data/", { user_id: userId }),
            axios.post("http://localhost:8000/get_organization_data/", { user_id: userId }),
          ]);
          
          if (userResponse.data.user) setData(userResponse.data.user);
          if (orgResponse.data.success){
            setOrgData(orgResponse.data.org);
          } 
            
        } catch (error) {
          console.error("Error fetching data:", error);
          setData(null);
        }
      }
      setLoading(false);
    };

    const getCookie = (name) => {
      const cookieName = `${name}=`;
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(";");

      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName)) {
          return cookie.substring(cookieName.length);
        }
      }
      return null;
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div className="container-title">
        <h2 className="h-title">Hello, {data.fname}</h2>
        <h3 className="b-title">{orgData.orgName}</h3>
      </div>

      <Container fluid>
        <div className="dashboard-content">
          <Nav variant="tabs" className="justify-content-left links-tab">
            <Nav.Item>
              <Nav.Link
                onClick={() => navigate("/dashboard")}
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => navigate("/dashboard/inventory")}
                className={location.pathname === "/dashboard/inventory" ? "active" : ""}
              >
                Inventory
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => navigate("/dashboard/salescontent")}
                className={location.pathname === "/dashboard/salescontent" ? "active" : ""}
              >
                Sales
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => navigate("/dashboard/reports")}
                className={location.pathname === "/dashboard/reports" ? "active" : ""}
              >
                Reports
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => navigate("/dashboard/itemcontent")}
                className={location.pathname === "/dashboard/itemcontent" ? "active" : ""}
              >
                Item Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => navigate("/dashboard/predict")}
                className={location.pathname === "/dashboard/predict" ? "active" : ""}
              >
                Budget Optimization
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="content">
            <Routes>
              <Route path="/" element={<HomeContent />} />
              <Route path="/inventory" element={<InventoryContent />} />
              <Route path="/salescontent" element={<SalesContent />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/itemcontent" element={<ItemOrderContent />} />
              <Route path="/predict" element={<PredictItems/>}/>
            </Routes>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;

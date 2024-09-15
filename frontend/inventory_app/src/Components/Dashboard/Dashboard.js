import React, { useEffect } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';

import '../Dashboard/Dashboard.css';
import HomeContent from '../HomeContent/HomeContent';
import InventoryContent from '../InventoryContent/InventoryContent';
import SalesOrder from '../SalesOrder/SalesOrder'
import ItemOrder from '../ItemOrder/Item_order'

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

        const user = getCookie("userId");
        if (!user) {
            navigate("/sign_in");
        }
    }, [navigate]);

    // Determine if the current route is the dashboard home route
    const isDashboardHome = location.pathname === '/dashboard';

    return (
        <Container fluid>
            <div className='dashboard-content'>
                <div className="sidebar">
                    <Nav className="flex-column">
                        <Nav.Link onClick={() => navigate('/dashboard')}>Home</Nav.Link>
                        <Nav.Link onClick={() => navigate('/dashboard/inventory')}>Inventory</Nav.Link>
                        <Nav.Link onClick={() => navigate('/dashboard/sales-order')}>Sales</Nav.Link>
                        <Nav.Link onClick={() => navigate('/dashboard/reports')}>Reports</Nav.Link>
                        <Nav.Link onClick={() => navigate('/dashboard/item-orders')}>Item Orders</Nav.Link>
                    </Nav>
                </div>
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomeContent />} />
                        <Route path="/inventory" element={<InventoryContent />} />
                        <Route path="/sales-order" element={<SalesOrder />} />
                        <Route path="/reports" element={
                            <div className="page-content">
                                <h1>This is the Reports Page</h1>
                                <p>Content for the reports page goes here.</p>
                            </div>
                        } />
                        <Route path="/item-orders" element={<ItemOrder />} />
                    </Routes>
                </div>
            </div>
        </Container>
    );
};

export default Dashboard;

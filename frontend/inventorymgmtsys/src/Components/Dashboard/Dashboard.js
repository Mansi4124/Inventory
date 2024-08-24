import React, { useState } from 'react';
import { Container, Nav} from 'react-bootstrap';

import '../Dashboard/Dashboard.css'; // Import custom CSS
import HomeContent from '../Homecontent/HomeContent';
import InventoryContent from '../InventoryContent/InventoryContent';

const Dashboard = () => {
    const [selectedPage, setSelectedPage] = useState('home');
  

    const renderContent = () => {
        switch (selectedPage) {
            case 'home':
                return (
                    <div className="page-content">
                        <HomeContent />
                    </div>
                );
            case 'inventory':
                return (
                    <div className="page-content">
                       <InventoryContent/>
                    </div>
                );
            case 'sales':
                return (
                    <div className="page-content">
                        <h1>This is the Sales Page</h1>
                        <p>Content for the sales page goes here.</p>
                    </div>
                );
            case 'reports':
                return (
                    <div className="page-content">
                        <h1>This is the Reports Page</h1>
                        <p>Content for the reports page goes here.</p>
                    </div>
                );
            default:
                return (
                    <div className="page-content">
                        <h1>Welcome to the Dashboard</h1>
                        <p>Select an option from the sidebar to get started.</p>
                    </div>
                );
        }
    };
    

    return (
        <Container fluid>
            <div className='dashboard-content'>
                <div className="sidebar">
                    <Nav className="flex-column">
                        <Nav.Link href="#home" onClick={() => setSelectedPage('home')}>Home</Nav.Link>
                        <Nav.Link href="#inventory" onClick={() => setSelectedPage('inventory')}>Inventory</Nav.Link>
                        <Nav.Link href="#sales" onClick={() => setSelectedPage('sales')}>Sales</Nav.Link>
                        <Nav.Link href="#reports" onClick={() => setSelectedPage('reports')}>Reports</Nav.Link>
                    </Nav>
                </div>
                <div className="content">
                    {renderContent()}
                </div>
            </div>
        </Container>
    );
};

export default Dashboard;

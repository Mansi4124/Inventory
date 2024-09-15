import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavBar from './Components/Navbar/NavBar';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AddOrganization from './Components/AddOrganization/Add_organization';
import SignIn from './Components/Sign_in/Sign_in';
import Home from './Components/Homepage/Homepage';
import SignUp from './Components/Sign_up/Sign_up';
import SalesOrder from './Components/SalesOrder/SalesOrder';
import Dashboard from './Components/Dashboard/Dashboard';
import Profile from "./Components/Profile/Profile";
import ItemForm from './Components/ItemForm/ItemForm';
import Composite from './Components/CompositeItem/Composite_item';
import InventoryContent from './Components/InventoryContent/InventoryContent';
import MyOrganization from './Components/MyOrganization/MyOrganization';
import ContactUs from './Components/ContactUs/ContactUs';
import Features from './Components/Features/Features';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';

const AppContent = () => {
    const location = useLocation(); // Get the current path

    return (
        <>
            {/* Conditionally render the NavBar based on the current route */}
            {location.pathname !== '/admin-dashboard' && <NavBar />}
            
            <Routes>
                <Route path="/add-organization" element={<AddOrganization />} />
                <Route path="/" element={<Home />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/sign_in" element={<SignIn />} />
                <Route path="/sign_up" element={<SignUp />} />
                <Route path="/itemform" element={<ItemForm />} />
                <Route path="/compositeform" element={<Composite />} />
                <Route path="/my-organization" element={<MyOrganization />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact_us" element={<ContactUs />} />
                <Route path="/features" element={<Features />} />
                <Route path="/sales-order" element={<SalesOrder />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;

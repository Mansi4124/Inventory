import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavBar from './Components/Navbar/NavBar';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import AddOrganization from './Components/AddOrganization/Add_organization';
import SignIn from './Components/Sign_in/Sign_in';
import Home from './Components/Homepage/Homepage';
import SignUp from './Components/Sign_up/Sign_up';
import SalesOrder from './Components/SalesOrder/SalesOrder';
import Dashboard from './Components/Dashboard/Dashboard';
import ItemOrder from './Components/ItemOrder/Item_order';
import Profile from "./Components/Profile/Profile";
import ItemForm from './Components/ItemForm/ItemForm';
import Composite from './Components/CompositeItem/Composite_item';
import MyOrganization from './Components/MyOrganization/MyOrganization';
import ContactUs from './Components/ContactUs/ContactUs';
import Features from './Components/Features/Features';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import ManageItemForm from './Components/ManageItemForm/ManageItemForm';
import ReviewForm from './Components/ReviewForm/ReviewForm';
import SalesContent from './Components/SalesContent/SalesContent';
import ItemOrderContent from './Components/ItemOrderContent/ItemOrderContent';
import PredictItems from './Components/PredictItems/PredictItems';
import ViewSales from "./Components/ViewSales/ViewSales"
import ViewItemOrder from './Components/ViewItemOrder/ViewItemOrder';
const AppContent = () => {
    const location = useLocation(); // Get the current path
    function getCookie(name) {
        const cookieArr = document.cookie.split(";"); // Split cookies by semicolons
    
        for (let i = 0; i < cookieArr.length; i++) {
          let cookie = cookieArr[i].trim(); // Remove whitespace at the beginning
    
          // Check if the cookie starts with the desired name
          if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1); // Return cookie value
          }
        }
    
        return null; // Return null if not found
      }
    const role = getCookie("role");
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
                <Route path="/item-orders" element={<ItemOrder />} />
                {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
                <Route path="/manage-item-form" element={<ManageItemForm />} />
                <Route path="/review" element={<ReviewForm/>}/>
                <Route path="/salescontent" element={<SalesContent/>}/>
                <Route path='/itemorder' element={<ItemOrderContent/>}/>
                <Route path='/predict' element={<PredictItems/>}/>
                <Route path="/view-sales" element={<ViewSales/>} />
                <Route path="/view-itemorder" element={<ViewItemOrder/>} />
                {
                    role === 'admin' && (<>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    </>)
                }
                <Route path="*" element={<Navigate to="/" />} />
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

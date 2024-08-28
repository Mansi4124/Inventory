import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarAfter from './Components/NavbarAfter/NavbarAfter';
import AddOrganization from './Components/AddOrganization/AddOrganization';
import SignIn from './Components/Sign_in/Sign_in';
import Home from './Components/Homepage/Homepage';
import SignUp from './Components/Sign_up/Sign_up';
import Dashboard from './Components/Dashboard/Dashboard';
import ItemForm from './Components/ItemForm/ItemForm';
import Composite from './Components/CompositeItem/Composite_item';
<<<<<<< Updated upstream

=======
import InventoryContent from './Components/InventoryContent/InventoryContent';
import MyOrganization from './Components/MyOrganization/MyOrganization';
import Profile from "./Components/Profile/Profile"
>>>>>>> Stashed changes
const App = () => {
    const [organizationName, setOrganizationName] = useState('');

    return (
        <Router>
            <NavbarAfter organizationName={organizationName} />
            <Routes>
<<<<<<< Updated upstream
                <Route path="/add-organization" element={<AddOrganization setOrganizationName={setOrganizationName} />} />
               <Route path="/" element={<Home/>} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/sign_in" element={<SignIn  />}></Route>
               <Route path="/sign_up" element={<SignUp />}></Route>
               <Route path="/itemform" element={<ItemForm/>}></Route>
               <Route path="/compositeform" element={<Composite/>}></Route>

=======
                <Route path="/add-organization" element={<AddOrganization />} />
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sign_in" element={<SignIn />}></Route>
                <Route path="/sign_up" element={<SignUp />}></Route>
                <Route path="/itemform" element={<ItemForm />}></Route>
                <Route path="/compositeform" element={<Composite />}></Route>
                <Route path="/inventory" element={<InventoryContent />} />
                <Route path="/my-organization" element={<MyOrganization/>}/>
                <Route path="/profile" element={<Profile/>}/>
>>>>>>> Stashed changes
            </Routes>
        </Router>
    );
};

export default App;






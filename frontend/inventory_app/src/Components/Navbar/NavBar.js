import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../Navbar/NavBar.css';
import axios from 'axios';
import logo from '../../assets/InventoryIQ.png'

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; SameSite=Lax`;
}

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [orgAdded, setOrgAdded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [orgName, setOrgName] = useState('My Organization');
  const [navMenuOpen, setNavMenuOpen] = useState(false); // State for responsive menu
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

    const fetchData = async () => {
      const userId = getCookie('userId');
      if (userId) {
        setLoggedIn(true);
        const res = await axios.post("http://localhost:8000/get_organization_data/", { "user_id": userId });
        if (res.data.success) {
          setOrgAdded(true);
          setOrgName(res.data.org['orgName']);
        }
      }
    };

    fetchData();
  }, [location]);

  const handleSignOut = () => {
    deleteCookie("userId");
    deleteCookie("role");
    window.location.reload();
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Debugging state toggle
  const toggleNavMenu = () => {
    console.log('Toggling menu');
    setNavMenuOpen(prevState => !prevState);
  };

  return (
    <nav className="navbar">
      <h1 className="logo"><a href="/"><img src={logo} alt="Logo" /></a></h1>
      <button className="menu-toggle" onClick={toggleNavMenu}>
        ☰
      </button>
      <ul className={`nav-links ${navMenuOpen ? 'active' : ''}`}>
        <li><a href="/contact_us">Contact Us</a></li>
        {loggedIn && !orgAdded && <li><a href="/add-organization">Add organization</a></li>}
        {!loggedIn ? (
          <>
            <li><a href="#features" onClick={() => scrollToSection('features')}>Features</a></li>
            <li><a href="/sign_in">Sign In</a></li>
            <li><a href="/sign_up">Sign Up</a></li>
          </>
        ) : (
          <>
            <li><a href="/features">Features</a></li>
            <li><a href="/review">Review</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            
          

            <li>
              <FaUserCircle
                className="profile-icon"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="profile-menu">
                  <a href="/profile">My Profile</a>
                  <a href="/my-organization">{orgName}</a>
                  <a href="/" onClick={handleSignOut}>Sign Out</a>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

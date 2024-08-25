import React, { useEffect, useState } from 'react';
import '../Navbar/NavBar.css';

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; SameSite=Lax`;
}

const NavBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
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
        setLoggedIn(true)
      }
    };
  
    fetchData();
  
  }, []);
  return (
    <nav className="navbar">
      <h1 className="logo"><a href="/">InventoryLogo</a></h1>
      <ul className="nav-links">
        <li><a href="/">Features</a></li>
        <li><a href="/sign_in">Add Organization</a></li>
        <li><a href="#contact">Contact Us</a></li>
        {!loggedIn && <li><a href="/sign_in">signIn</a></li>}
        {!loggedIn && <li><a href="/sign_up">signUp</a></li>}
        {loggedIn && <li><a href="/" onClick={()=>{deleteCookie("userId")}} >Sign Out</a></li>}
      </ul>
    </nav>
  );
};

export default NavBar;

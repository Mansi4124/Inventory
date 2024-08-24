import React from 'react';
import '../Navbar/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo"><a href="/">InventoryLogo</a></h1>
      <ul className="nav-links">
        <li><a href="/">Features</a></li>
        <li><a href="/sign_in">Add Organization</a></li>
        <li><a href="#contact">Contact Us</a></li>
        <li><a href="/sign_in">signIn</a></li>
        <li><a href="/sign_up">signUp</a></li>

      </ul>
    </nav>
  );
};

export default NavBar;

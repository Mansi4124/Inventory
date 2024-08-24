import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import profileIcon from '../../assets/profile.jpeg';  // Path to your profile icon
import './NavbarAfter.css';  // Import the custom CSS file

const NavbarAfter = ({ organizationName }) => {
    return (
        <Navbar className="navbar-custom" expand="lg" sticky="top">
            <Navbar.Brand href="#">
                <img
                    src={profileIcon}
                    alt="Company Logo"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />
                <span className="ms-2">My Company Name</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <span className="navbar-text me-3">{organizationName}</span>
                    {!organizationName && (
                        <Nav.Link as={Link} to="/add-organization">
                            Add Your Organization
                        </Nav.Link>
                    )}
                    <Nav.Link href="#">
                        <img
                            src={profileIcon}
                            alt="Profile Icon"
                            width="35"
                            height="35"
                            className="rounded-circle"
                        />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarAfter;

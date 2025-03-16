import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Dropdown, Button, Container } from "react-bootstrap";
import "./NavigationBar.css"; // Custom styles

function NavigationBar() {
  const [activeLink, setActiveLink] = useState("Home");
  const [notifications] = useState([
    "New message from Admin",
    "Your profile has been updated",
    "Upcoming meeting tomorrow at 10 AM",
    "New user registered",
    "Server maintenance scheduled",
    "Your request has been approved",
  ]);

  return (
    <Navbar expand="lg" className="custom-navbar border-bottom border-primary px-3">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/">
          <img src="/public/guidera_logo.PNG" alt="Guidera Logo" width="70" height="45" />
        </Navbar.Brand>

        {/* Hamburger Menu Button */}
        <Navbar.Toggle aria-controls="navbar-nav" className="custom-hamburger" />

        {/* Collapsible Navbar Content */}
        <Navbar.Collapse id="navbar-nav">
          {/* Navigation Links */}
          <Nav className="mx-auto">
            {["Home", "Services", "Chatbot", "Contact Us", "About Us"].map((item) => (
              <Nav.Link
                key={item}
                href="#"
                className={`nav-link ${activeLink === item ? "active-link" : "inactive-link"}`}
                onClick={() => setActiveLink(item)}
              >
                {item}
              </Nav.Link>
            ))}
          </Nav>

          {/* Right-Side Icons and Buttons */}
          <div className="d-flex align-items-center gap-3">
            {/* Notification Dropdown */}
            {/* Notification Dropdown */}
            {/* Notification Dropdown */}
            <Dropdown className="dropdown-notifications" drop="down" align="end">
              <Dropdown.Toggle as="div" className="position-relative" style={{ cursor: "pointer" }}>
                <img src="/bell.svg" alt="Notifications" width="25" height="25" />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="p-2 shadow"
                style={{ minWidth: "250px", maxHeight: "250px", overflowY: "auto" }}
                popperConfig={{
                  modifiers: [
                    {
                      name: "preventOverflow",
                      options: {
                        boundary: "viewport",
                        altAxis: true,
                        tether: false,
                      },
                    },
                    {
                      name: "flip",
                      options: {
                        fallbackPlacements: ["bottom-end", "bottom-start", "top-end", "top-start"],
                      },
                    },
                  ],
                }}
              >
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <Dropdown.Item key={index} className="text-wrap">
                      {notification}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No new notifications</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>



            {/* Theme Icon */}
            <img src="/public/theme.PNG" alt="Theme Icon" width="25" height="25" className="me-2" />

            {/* Login & Signup Buttons */}
            <button type="button" className="login-button btn btn-outline-light ms-3">Login</button>
            <button type="button" className="sign-up btn btn-light text-primary ms-2">Signup</button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;

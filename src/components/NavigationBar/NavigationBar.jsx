import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import axios from "axios";
import "./NavigationBar.css";

function NavigationBar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeLink, setActiveLink] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [notifications] = useState([
    "New message from Admin",
    "Your profile has been updated",
    "Upcoming meeting tomorrow at 10 AM",
    "New user registered",
    "Server maintenance scheduled",
    "Your request has been approved",
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar border-bottom border-2 border-primary ${theme} px-3 `}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src={theme === "light" ? "/guidera_logo_white.PNG" : "/guidera_logo_dark.PNG"}
            alt="Guidera Logo"
            width="70"
            height="45"
          />

        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="custom-hamburger"
        />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            {[
              { name: "Home", path: "/" },
              { name: "Find University", path: "/FindUniversity" },
              { name: "Chatbot", path: "/chatbot" },
              { name: "Contact Us", path: "/contactus" },
              { name: "About Us", path: "/aboutus" },
            ].map(({ name, path }) => (
              <Nav.Link
                key={name}
                as={Link}
                to={path}
                className={`nav-link ${activeLink === name ? "active-link" : "inactive-link"
                  }`}
                onClick={() => setActiveLink(name)}
              >
                {name}
              </Nav.Link>
            ))}
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {/* Notifications Dropdown */}
            <Dropdown
              className="dropdown-notifications"
              drop="down"
              align="end"
            >
              <Dropdown.Toggle
                as="div"
                className="position-relative"
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/bell.svg"
                  alt="Notifications"
                  width="25"
                  height="25"
                />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications.length}
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="p-2 shadow"
                style={{
                  minWidth: "250px",
                  maxHeight: "250px",
                  overflowY: "auto",
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

            <img
              src={theme === "light" ? "/theme2.png" : "/theme.png"}
              alt="Theme Icon"
              width="25"
              height="25"
              className="theme-toggle-icon me-2"
              onClick={toggleTheme}
            />

            {/* Profile / Login-Signup */}
            {isLoggedIn ? (
              <Link to="/profile">
                <img
                  src={"/blueprint.png"}
                  alt="Profile"
                  width="35"
                  height="35"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button type="button" className="btn login-button ms-3">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    type="button"
                    className="sign-up btn btn-light text-primary ms-2"
                  >
                    Signup
                  </button>
                </Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;

import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import axios from "axios";
import "./NavigationBar.css";
import Notification from "../Notification/Notification";

function NavigationBar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveLink = () => {
    if (currentPath === "/") return "Home";
    if (currentPath === "/FindUniversity") return "Find University";
    if (currentPath === "/chatbot") return "Chatbot";
    if (currentPath === "/TestPreparation") return "Test Preparation";
    if (currentPath === "/tracking") return "Tracking & Analysis";
    if (currentPath === "/saved") return "Saved Programs";
    if (currentPath === "/contactus") return "Contact Us";
    if (currentPath === "/aboutus") return "About Us";
    return "";
  };

  const activeLink = getActiveLink();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      axios
        .get("http://localhost:3000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProfilePhoto(response.data.profilephoto);
        })
        .catch((error) => {
          console.error("Failed to fetch profile photo:", error);
        });
    }
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar border-bottom border-2 border-primary ${theme} px-3`}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <img
            src={
              theme === "light"
                ? "/guidera_logo_white.PNG"
                : "/guidera_logo_dark.PNG"
            }
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
          <Nav className="mx-auto d-flex align-items-center">
            {/* Home */}
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link mx-0 ${
                activeLink === "Home" ? "active-link" : "inactive-link"
              }`}
            >
              Home
            </Nav.Link>

            {/* Services Dropdown */}
            <NavDropdown
              title="Services"
              id="services-dropdown"
              className={`nav-link mx-0 ${
                [
                  "Find University",
                  "Chatbot",
                  "Test Preparation",
                  "Tracking & Analysis",
                ].includes(activeLink)
                  ? "active-link"
                  : "inactive-link"
              }`}
            >
              {[
                { name: "Find University", path: "/FindUniversity" },
                { name: "Test Preparation", path: "/TestPreparation" },
                { name: "Chatbot", path: "/chatbot" },
                { name: "Tracking & Analysis", path: "/tracking" },
              ].map(({ name, path }) => (
                <NavDropdown.Item as={Link} to={path} key={name}>
                  {name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            {/* Saved Programs */}
            <Nav.Link
              as={Link}
              to="/saved"
              className={`nav-link mx-0 ${
                activeLink === "Saved Programs"
                  ? "active-link"
                  : "inactive-link"
              }`}
            >
              Saved Programs
            </Nav.Link>

            {/* Contact Us */}
            <Nav.Link
              as={Link}
              to="/contactus"
              className={`nav-link mx-0 ${
                activeLink === "Contact Us" ? "active-link" : "inactive-link"
              }`}
            >
              Contact Us
            </Nav.Link>

            {/* About Us */}
            <Nav.Link
              as={Link}
              to="/aboutus"
              className={`nav-link mx-0 ${
                activeLink === "About Us" ? "active-link" : "inactive-link"
              }`}
            >
              About Us
            </Nav.Link>
          </Nav>

          {/* Right Section: Notification, Theme Toggle, Auth Buttons */}
          <div className="d-flex align-items-center gap-3">
            <Notification />

            <img
              src={theme === "light" ? "/theme2.png" : "/theme.png"}
              alt="Theme Icon"
              width="25"
              height="25"
              className="theme-toggle-icon me-2"
              onClick={toggleTheme}
            />

            {isLoggedIn ? (
              <Link to="/profile">
                <img
                  src={profilePhoto || "/blueprint.png"}
                  alt="Profile"
                  width="40px"
                  height="40px"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
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

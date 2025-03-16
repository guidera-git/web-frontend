import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import "./NavigationBar.css"; // Import custom styles

function NavigationBar() {
  const [activeLink, setActiveLink] = useState("Home");
  const [notifications, setNotifications] = useState([
    "New message from Admin",
    "Your profile has been updated",
    "Upcoming meeting tomorrow at 10 AM",
    "New user registered",
    "Server maintenance scheduled",
    "Your request has been approved",
  ]);

  return (
    <header className="custom-navbar d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div className="col-md-1 mb-2 mb-md-0">
        <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
          <img src="/public/guidera_logo.PNG" alt="Guidera Logo" width="70" height="45" />
        </a>
      </div>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        {["Home", "Services", "Chatbot", "Contact Us", "About Us"].map((item) => (
          <li key={item}>
            <a
              href="#"
              className={`nav-link ${activeLink === item ? "active-link" : "inactive-link"}`}
              onClick={() => setActiveLink(item)}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <div className="col-auto text-end d-flex align-items-center">
        {/* Notification Dropdown (Bell Icon as Trigger) */}
        <Dropdown align="end">
          <Dropdown.Toggle as="div" className="position-relative me-4" style={{ cursor: "pointer" }}>
            <img src="/bell.svg" alt="Notifications" width="25" height="25" />
            {notifications.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications.length}
              </span>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu className="p-2 shadow" style={{ minWidth: "250px", maxHeight: "250px", overflowY: "auto" }}>
            {notifications.length > 0 ? (
              <>
                <ul className="list-unstyled ps-3">
                  {notifications.map((notification, index) => (
                    <li key={index} className="mb-1">
                      • {notification}
                    </li>
                  ))}
                </ul>
                <Dropdown.Divider />
              </>
            ) : (
              <Dropdown.Item disabled>No new notifications</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>

        {/* Login & Signup Buttons */}

        <img src="/public/theme.PNG" alt="Theme Icon" width="25" height="25" className="me-3" />
        <button type="button" className="login-button btn btn-outline-light ms-3">Login</button>
        <button type="button" className="sign-up btn btn-light text-primary ms-2">Signup</button>
      </div>
    </header>
  );
}

export default NavigationBar;

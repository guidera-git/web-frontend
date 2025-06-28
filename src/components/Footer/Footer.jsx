import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";

import { ThemeContext } from "../../ThemeContext";
function Footer() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="container-fluid p-0">
      <footer className="custom-footer d-flex flex-column">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-4 border-top">
          <div className="col mb-3 d-flex flex-column align-items-start">
            <a
              href="/"
              className="d-flex align-items-center mb-3 link-light text-decoration-none"
            >
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
            </a>
            <div className="d-flex">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <i className="bi bi-twitter social-icon"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <i className="bi bi-facebook social-icon"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram social-icon"></i>
              </a>
            </div>
          </div>

          <div className="col mb-3">
            <ul className="nav flex-column">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "#" },
                { name: "Chatbot AI", path: "/chatbot" },
                { name: "Contact Us", path: "/contactus" },
                { name: "About Us", path: "/aboutus" },
              ].map((item) => (
                <li key={item.name} className="nav-item mb-2">
                  <a href={item.path} className="nav-link p-0 footer-link">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col mb-3">
            <ul className="nav flex-column">
              {[
                "Pricing",
                "Privacy Policy",
                "Terms & Conditions",
                "Cookies",
                "Help",
              ].map((item) => (
                <li key={item} className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 footer-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col mb-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <span className="footer-link">Download our App</span>
              </li>
              <li className="nav-item mb-2">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn login-button  btn-sm"
                >
                  Android
                </a>
              </li>
              <li className="nav-item mb-2">
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn login-button btn-sm"
                >
                  iOS
                </a>
              </li>
            </ul>
          </div>

          <div className="col mb-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <span className="footer-link">For Queries</span>
              </li>
              <li className="nav-item mb-2">
                <input
                  type="email"
                  className="form-control custom-input"
                  placeholder="Enter your email"
                />
              </li>
              <li className="nav-item mb-2">
                <textarea
                  className="form-control custom-input"
                  placeholder="Enter your query"
                  rows="3"
                ></textarea>
              </li>
              <li className="nav-item mb-2">
                <button className="login-button btn btn-sm">Submit</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom d-flex justify-content-center py-3 border-top mt-auto">
          <p className="mb-0 text-center">
            © 2025 Guidera, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

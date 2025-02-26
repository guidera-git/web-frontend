import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavigationBar.css"; 

function NavigationBar() {
  const [activeLink, setActiveLink] = useState("Home"); 

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
  <img src="/public/theme.PNG" alt="Theme Icon" width="25" height="25" className="me-2" />
  <button type="button" className="login-button btn btn-outline-light me-2">Login</button>
  <button type="button" className="sign-up btn btn-light text-primary ">Signup</button>
</div>


    </header>
  );
}

export default NavigationBar;

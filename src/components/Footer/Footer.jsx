import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css"; 

function Footer() {
  return (
    <div className="container-fluid text-white p-0">
      <footer className="custom-footer d-flex flex-column">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-4 border-top">
        <div className="col mb-3 d-flex flex-column align-items-start">
  <a href="/" className="d-flex align-items-center mb-3 link-light text-decoration-none">
    <img src="/public/guidera_logo.PNG" alt="Guidera Logo" width="80" height="60" />
  </a>
  <div className="d-flex">
    <a href="https://twitter.com" target="_blank" className="me-3">
      <i className="bi bi-twitter text-light fs-4"></i>
    </a>
    <a href="https://facebook.com" target="_blank" className="me-3">
      <i className="bi bi-facebook text-light fs-4"></i>
    </a>
    <a href="https://instagram.com" target="_blank">
      <i className="bi bi-instagram text-light fs-4"></i>
    </a>
  </div>
</div>



          <div className="col mb-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Home</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Services</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Chatbot AI</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Contact Us</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">About Us</a></li>
            </ul>
          </div>

          <div className="col mb-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Pricing</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Privacy Policy</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Terms & Conditions</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Cookies</a></li>
              <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-white">Help</a></li>
            </ul>
          </div>

          <div className="col mb-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-white">Download our App</a>
              </li>
              <li className="nav-item mb-2">
                <a href="https://play.google.com/store" target="_blank" className="btn custom-outline-btn btn-outline-light btn-sm"> Android</a>
              </li>
              <li className="nav-item mb-2">
                <a href="https://www.apple.com/app-store/" target="_blank" className="btn custom-outline-btn btn-outline-light btn-sm"> iOS</a>
              </li>
            </ul>
          </div>
          <div className="col mb-3">
  <ul className="nav flex-column">
    <li className="nav-item mb-2">
      <span className="nav-link p-0 text-white ">For Queries</span>
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
      <button className="login-button btn  btn-sm">Submit</button>
    </li>
  </ul>
</div>

        </div>
        

        <div className="footer-bottom d-flex justify-content-center py-3 border-top mt-auto">
  <p className="mb-0 text-center">© 2024 Guidera, Inc. All rights reserved.</p>
</div>

      </footer>
    </div>
  );
}

export default Footer;

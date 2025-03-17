import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/login");
  };

  return (
    <div className="custom-container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-md d-flex align-items-center justify-content-center flex-column p-4 text-white">

            <img
              src="/guidera_logo.PNG"
              alt="Guidera Logo"
              className="mb-3 mt-0"
              style={{ width: "150px", paddingTop: "5px" }}
            />

            <button className="btn google-btn mb-3 d-flex align-items-center justify-content-center">
              <img
                src="/google.svg"
                alt="Google Logo"
                style={{ width: "20px", marginRight: "10px" }}
              />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="d-flex align-items-center my-3" style={{ width: "55%" }}>
              <hr className="flex-grow-1 text-white" />
              <span className="mx-2">or with Email</span>
              <hr className="flex-grow-1 text-white" />
            </div>

            <div style={{ width: "55%" }} className="text-start">
              <label className="w-100 mb-1">
                Full Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control border-0 border-bottom bg-transparent text-white mb-2 rounded-0"
                placeholder="Enter your full name"
              />

              <label className="w-100 mb-1">
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                className="form-control border-0 border-bottom bg-transparent text-white mb-2 rounded-0"
                placeholder="Enter your email"
              />

              <label className="w-100 mb-1">
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                className="form-control border-0 border-bottom bg-transparent text-white mb-2 rounded-0"
                placeholder="Enter your password"
              />

              <label className="w-100 mb-1">
                Confirm Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                className="form-control border-0 border-bottom bg-transparent text-white mb-2 rounded-0"
                placeholder="Confirm your password"
              />

              <div className="form-check mb-3 text-start">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "35%" }}
              onClick={handleSignup}
            >
              Sign Up
            </button>

            <p className="mt-3">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#0d6efd", cursor: "pointer", textDecoration: "underline" }}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

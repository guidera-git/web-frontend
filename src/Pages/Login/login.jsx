import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; 
function Login() {
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

            <div className="d-flex align-items-center my-3" style={{ width: "55%" }}>
              <hr className="flex-grow-1 text-white" />
              <span className="mx-2">or with Email</span>
              <hr className="flex-grow-1 text-white" />
            </div>

            <div style={{ width: "55%" }} className="text-start">
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

              <div className=" mt-1">
                <a href="#" style={{ color: "#0d6efd" }}>Forgot Password?</a>
              </div>
            </div>

            <button className="btn btn-primary mt-3" style={{ width: "35%" }}>Login</button>

            <p className="mt-3">
              Don't have an account? <a href="#" style={{ color: "#0d6efd" }}>Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

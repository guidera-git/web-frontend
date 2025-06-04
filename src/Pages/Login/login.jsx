import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data && response.data.token) {
        console.log("perfect");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        navigate("/");
      } else {
        setErrorMsg("Unexpected response from server.");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setErrorMsg("Incorrect email or password.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="custom-container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-md d-flex align-items-center justify-content-center flex-column p-4 text-white">
            <img
              src="/guidera_logo.PNG"
              alt="Guidera Logo"
              className="mb-3 mt-0 justify-content-center"
              style={{ width: "150px", paddingTop: "5px" }}
            />
            <h2 className="p-1">Welcome Back</h2>
            <h3 className="p-1">Log into your Account</h3>

            <div
              className="d-flex align-items-center my-3"
              style={{ width: "55%" }}
            >
              <hr className="flex-grow-1 text-white" />
              <span className="mx-2">with Email</span>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="w-100 mb-1">
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                className="form-control border-0 border-bottom bg-transparent text-white mb-2 rounded-0"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errorMsg && (
                <div className="text-danger mt-2" style={{ fontSize: "14px" }}>
                  {errorMsg}
                </div>
              )}

              <div className="mt-1">
                <a href="#" style={{ color: "#0d6efd" }}>
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              className="btn btn-primary mt-3"
              style={{ width: "35%" }}
              onClick={handleLogin}
            >
              Login
            </button>

            <p className="mt-3">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{
                  color: "#0d6efd",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

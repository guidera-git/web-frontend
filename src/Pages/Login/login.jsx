import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import {
  auth,
  provider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "../../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      if (response.data?.token) {
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
      console.error(error);
      setErrorMsg(
        error.response?.status === 401
          ? "Incorrect email or password."
          : "Something went wrong. Please try again."
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post(
        "http://localhost:3000/api/auth/google",
        { idToken }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMsg("Google sign-in failed. Try again.");
    }
  };

  return (
    <>
      {/* Main Login Page */}
      <section
        className="h-100 gradient-form"
        style={{ backgroundColor: "#333333" }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-light bg-new">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body">
                      <div className="col-md d-flex align-items-center justify-content-center flex-column p-4 text-light">
                        <h2 className="p-1">
                          Welcome <span className="text-primary">Back</span>
                        </h2>
                        <h4 className="p-1">Log into your Account</h4>

                        <button
                          onClick={handleGoogleLogin}
                          className="btn google-btn d-flex align-items-center justify-content-center rounded-pill"
                        >
                          <img
                            src="/google.svg"
                            alt="Google Logo"
                            style={{ width: "20px", marginRight: "5px" }}
                          />
                          Continue with Google
                        </button>

                        <div
                          className="d-flex align-items-center my-3"
                          style={{ width: "85%" }}
                        >
                          <hr className="flex-grow-1 text-light" />
                          <span className="mx-2">or with Email</span>
                          <hr className="flex-grow-1 text-light" />
                        </div>

                        <div style={{ width: "85%" }} className="text-start">
                          <input
                            type="email"
                            className="form-control p-2 custom-input mb-2"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <input
                            type="password"
                            className="form-control p-2 custom-input mb-2"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />

                          {errorMsg && (
                            <div
                              className="text-danger mt-2"
                              style={{ fontSize: "14px" }}
                            >
                              {errorMsg}
                            </div>
                          )}

                          <div className="mt-1">
                            <span
                              style={{ color: "#0d6efd", cursor: "pointer" }}
                            >
                              Forgot Password?
                            </span>
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
                  <div className="col-lg-6 d-flex align-items-center bg-white">
                    <div className="text-dark px-3 py-4 p-md-5 mx-md-4">
                      <div className="d-flex justify-content-center mb-3 mt-0">
                        <img
                          src="/guidera_logo_white.PNG"
                          alt="Guidera Logo"
                          style={{ width: "150px", paddingTop: "5px" }}
                        />
                      </div>
                      <h4 className="mb-4 text-primary fw-bold typewriter">
                        Guiding Your Academic Journey!
                      </h4>
                      <p className="fw-semibold text-justify">
                        Guidera is your dedicated partner in academic
                        decision-making. With a blend of advanced AI technology
                        and personalized guidance, we help students find their
                        ideal university and degree programs. Our mission is to
                        simplify the complexities of academic planning, so
                        students can focus on achieving their dreams.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

import { ThemeContext } from "../../ThemeContext";

function Signup() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        fullName,
        email,
        password,
      });

      if (res.status === 201 || res.status === 200) {
        navigate("/login"); // redirect to login page
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed");
    }
  };
  return (
    <section className="h-100 gradient-form" style={{ backgroundColor: "#333333" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-light bg-new">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body ">
                    <div className="col-md d-flex align-items-center justify-content-center flex-column p-4 text-light ">
                      <h2 className="p-1">
                        Create <span className="text-primary">Account</span>
                      </h2>

                      <button className="btn google-btn mb-3 d-flex align-items-center justify-content-center rounded-pill">
                        <img
                          src="/google.svg"
                          alt="Google Logo"
                          style={{ width: "20px", marginRight: "5px" }}
                        />
                        Continue with Google
                      </button>
                      <div
                        className="d-flex align-items-center my-6"
                        style={{ width: "55%" }}
                      >
                        <hr className="flex-grow-1 text-white" />
                        <span className="mx-2">or with Email</span>
                        <hr className="flex-grow-1 text-white" />
                      </div>
                      <div style={{ width: "85%" }} className="text-start">
                        <input
                          type="text"
                          name="fullName"
                          className="form-control p-2 custom-input mb-2"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                        <input
                          type="email"
                          name="email"
                          className="form-control p-2 custom-input mb-2"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <input
                          type="password"
                          name="password"
                          className="form-control p-2 custom-input mb-2"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control p-2 custom-input mb-2"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <div className="form-check mb-3 text-start">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberMe"
                          />
                          <label className="form-check-label" htmlFor="rememberMe">
                            Remember Me
                          </label>
                        </div>
                      </div>
                      {error && (
                        <div
                          className="alert alert-danger"
                          style={{ width: "55%" }}
                          role="alert"
                        >
                          {error}
                        </div>
                      )}
                      <button
                        className="btn btn-primary rounded-pill"
                        style={{ width: "35%" }}
                        onClick={handleSignup}
                      >
                        Sign Up
                      </button>
                      <p className="mt-3">
                        Already have an account?{" "}
                        <span
                          onClick={() => navigate("/login")}
                          style={{
                            color: "#0d6efd",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Login
                        </span>
                      </p>
                    </div>


                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center bg-white">
                  <div className="text-dark px-3 py-4 p-md-5 mx-md-4 w-100">
                    <div className="d-flex justify-content-center mb-3 mt-0">
                      <img
                        src="/guidera_logo_white.PNG"
                        alt="Guidera Logo"
                        className="img-fluid mx-auto d-block"
                        style={{ maxWidth: "150px", height: "auto" }}
                      />
                    </div>

                    <h4 className="mb-4 text-primary fw-bold typewriter">Guiding Your Academic Journey!</h4>

                    <p className="fw-semibold text-justify" style={{ textAlign: "justify" }}>
                      Guidera is your dedicated partner in academic decision-making. With a blend of advanced AI
                      technology and personalized guidance, we help students find their ideal university and degree
                      programs. Our mission is to simplify the complexities of academic planning, so students can
                      focus on achieving their dreams.
                    </p>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;

import React, { useState, useEffect } from "react";
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

  // OTP State
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Handle OTP Countdown
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
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
          ? "Incorrect email or password. Please try again."
          : "Something went wrong. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await axios.post("http://localhost:3000/api/auth/send-otp", {
        email,
      });

      if (res.status === 200) {
        setOtpSent(true);
        setOtpCountdown(600); // 10 minutes in seconds
        setErrorMsg("OTP sent successfully! Check your email.");
      }
    } catch (err) {
      console.error("OTP send error:", err.response?.data || err.message);
      setErrorMsg(
        err.response?.data?.error ||
          "Failed to send OTP. Please check your email and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP code");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      const res = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        {
          email,
          otp: otpCode,
        }
      );

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        navigate("/");
      }
    } catch (err) {
      console.error(
        "OTP verification error:",
        err.response?.data || err.message
      );
      setErrorMsg(
        err.response?.data?.error ||
          "Invalid or expired OTP. Please request a new one."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
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
      setErrorMsg(
        error.code === "auth/popup-closed-by-user"
          ? "Login popup was closed. Please try again."
          : "Google sign-in failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      await sendPasswordResetEmail(auth, email);
      setErrorMsg("Password reset email sent! Check your inbox.");
      setShowEmailDialog(false);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrorMsg(
        error.code === "auth/user-not-found"
          ? "No account found with this email address."
          : "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
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

                        {/* OTP Login Section */}
                        {otpMode ? (
                          <div className="w-100" style={{ maxWidth: "85%" }}>
                            <div className="mb-3">
                              <input
                                type="email"
                                className="form-control p-2 custom-input mb-2"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={otpSent}
                              />
                              {otpSent && (
                                <>
                                  <input
                                    type="text"
                                    className="form-control p-2 custom-input mb-2"
                                    placeholder="Enter OTP"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    maxLength={6}
                                  />
                                  {otpCountdown > 0 && (
                                    <small className="text-muted d-block mb-2">
                                      OTP expires in: {formatTime(otpCountdown)}
                                    </small>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="d-flex justify-content-between">
                              <button
                                className="btn btn-outline-light rounded-pill"
                                onClick={() => {
                                  setOtpMode(false);
                                  setOtpSent(false);
                                  setErrorMsg("");
                                }}
                                disabled={isLoading}
                              >
                                Back
                              </button>
                              <button
                                className="btn btn-primary rounded-pill"
                                onClick={
                                  otpSent ? handleVerifyOTP : handleSendOTP
                                }
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                ) : otpSent ? (
                                  "Verify OTP"
                                ) : (
                                  "Send OTP"
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* OTP Login Button */}
                            <button
                              onClick={() => setOtpMode(true)}
                              className="btn otp-btn mb-3 d-flex align-items-center justify-content-center rounded-pill"
                            >
                              <i className="bi bi-shield-lock me-2"></i>
                              Continue with OTP
                            </button>

                            {/* Google Login Button */}
                            <button
                              onClick={handleGoogleLogin}
                              className="btn google-btn mb-3 d-flex align-items-center justify-content-center rounded-pill"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                <img
                                  src="/google.svg"
                                  alt="Google Logo"
                                  style={{ width: "20px", marginRight: "5px" }}
                                />
                              )}
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

                            <div
                              style={{ width: "85%" }}
                              className="text-start"
                            >
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
                                  className={`alert ${
                                    errorMsg.includes("successfully")
                                      ? "alert-success"
                                      : "alert-danger"
                                  } mt-2`}
                                  style={{ fontSize: "14px" }}
                                >
                                  {errorMsg}
                                </div>
                              )}

                              <div className="mt-1">
                                <span
                                  style={{
                                    color: "#0d6efd",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setShowEmailDialog(true)}
                                >
                                  Forgot Password?
                                </span>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary mt-3"
                              style={{ width: "35%" }}
                              onClick={handleLogin}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                "Login"
                              )}
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
                          </>
                        )}
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

      {/* Password Reset Modal */}
      {showEmailDialog && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEmailDialog(false);
                    setErrorMsg("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Enter your email to receive a password reset link:</p>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                {errorMsg && (
                  <div
                    className={`alert ${
                      errorMsg.includes("sent")
                        ? "alert-success"
                        : "alert-danger"
                    } mt-2`}
                  >
                    {errorMsg}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEmailDialog(false);
                    setErrorMsg("");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;

import { ThemeContext } from "../../ThemeContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import "./Chatbot.css";
import axios from "axios";

function Chatbot() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`find-university ${theme}`}>
      <Section1 />
    </div>
  );
}

function Section1() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to chat
    const userMessage = { text: input, type: "outgoing" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login.");
      }

      // Call chatbot API
      const response = await axios.post(
        "http://localhost:3000/api/chatbot",
        { message: input },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        {
          text: response.data.reply,
          type: "incoming",
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to get response from chatbot";
      setError(errorMessage);

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't process your request. Please try again.",
          type: "incoming",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex custom-container vh-100">
      {/* Chat Box Container */}
      <div
        className="flex-grow-1 overflow-auto d-flex flex-column align-items-center p-3"
        style={{ maxHeight: "calc(100vh - 70px)", paddingBottom: "80px" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex ${
              msg.type === "outgoing"
                ? "justify-content-end"
                : "justify-content-start"
            } w-100 mb-2`}
          >
            <div
              className={`p-3 shadow-sm ${
                msg.type === "outgoing"
                  ? "bg-primary text-white"
                  : "bg-light text-dark"
              }`}
              style={{
                maxWidth: "50%",
                borderRadius: "25px",
                padding: "12px 18px",
                marginLeft: msg.type === "incoming" ? "20%" : "auto",
                marginRight: msg.type === "outgoing" ? "20%" : "auto",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="d-flex justify-content-start w-100 mb-2">
            <div
              className="p-3 shadow-sm bg-light text-dark"
              style={{
                maxWidth: "50%",
                borderRadius: "25px",
                padding: "12px 18px",
                marginLeft: "20%",
              }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Thinking...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-2" style={{ width: "80%" }}>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Field at Bottom */}
      <div
        className="position-fixed bottom-0 p-3 shadow start-50 translate-middle-x"
        style={{ width: "60%" }}
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light rounded-pill px-3"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ borderRadius: "30px" }}
            disabled={isLoading}
          />
          <button
            className="btn btn-light rounded-pill border ms-2"
            onClick={sendMessage}
            disabled={isLoading || input.trim() === ""}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <i className="bi bi-send text-primary"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

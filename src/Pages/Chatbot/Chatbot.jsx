import React, { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../../ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Chatbot.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
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
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  const suggestions = [
    { title: "Guidera", prompt: "What is Guidera?" },
    { title: "Business suggestion", prompt: "Suggest some business ideas" },
    { title: "Science", prompt: "What is Science?" },
    { title: "Photosynthesis", prompt: "what is Photosynthesis" },
  ];

  useEffect(() => {
    const hasInteracted = localStorage.getItem("chatbotHasInteracted");
    if (hasInteracted === "true") setShowSuggestions(true);

    const lastInteraction = localStorage.getItem("chatbotLastInteraction");
    if (lastInteraction) {
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(lastInteraction) > oneDay) {
        setShowSuggestions(true);
        localStorage.removeItem("chatbotHasInteracted");
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestionClick = (prompt) => {
    setInput(prompt);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    setShowSuggestions(false);
    localStorage.setItem("chatbotHasInteracted", "true");
    localStorage.setItem("chatbotLastInteraction", Date.now().toString());

    const userMessage = { text: input, type: "outgoing" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required. Please login.");

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

      setMessages((prev) => [
        ...prev,
        { text: response.data.reply, type: "incoming" },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to get response from chatbot";
      setError(errorMessage);

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
    <div className="d-flex custom-container vh-100 bg-white">
      <div
        className="flex-grow-1 overflow-auto d-flex flex-column align-items-center p-4"
        style={{ maxHeight: "calc(100vh - 70px)", paddingBottom: "100px" }}
      >
        {showSuggestions && messages.length === 0 && (
          <div className="w-100 text-center p-4 animate__animated animate__fadeIn">
            <span className="typing-text mb-3">
              How can I assist you today?
            </span>
            <p className="mb-4 text-muted">
              Tap a suggestion or type your own query.
            </p>
            <div className="row g-2 mb-4 justify-content-center">
              {suggestions.map((s, i) => (
                <div key={i} className="col-md-5 col-6">
                  <div
                    className="p-3 bg-light rounded hover-effect shadow-sm text-center"
                    onClick={() => handleSuggestionClick(s.prompt)}
                  >
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
            <div className="fst-italic text-muted mt-4">Ask anything…</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex ${
              msg.type === "outgoing"
                ? "justify-content-end"
                : "justify-content-start"
            } w-100 mb-2 chat-bubble`}
          >
            <div
              className={`p-3 shadow-sm ${
                msg.type === "outgoing"
                  ? "bg-primary text-white"
                  : "bg-light text-dark"
              }`}
              style={{
                maxWidth: "60%",
                borderRadius: "25px",
                padding: "12px 18px",
                marginLeft: msg.type === "incoming" ? "15%" : "auto",
                marginRight: msg.type === "outgoing" ? "15%" : "auto",
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

        {error && <div className="alert alert-danger mt-2 w-75">{error}</div>}

        <div ref={messagesEndRef} />
      </div>
      <div
        className="position-fixed bottom-0 start-50 translate-middle-x w-100"
        style={{ maxWidth: "800px", padding: "1rem" }}
      >
        <div className="d-flex align-items-center bg-white shadow rounded-pill px-4 py-2 border border-light">
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary rounded-circle ms-2 d-flex justify-content-center align-items-center"
            style={{ width: "42px", height: "42px" }}
            onClick={sendMessage}
            disabled={isLoading || input.trim() === ""}
          >
            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm text-white"
                role="status"
              ></div>
            ) : (
              <i className="bi bi-send text-white fs-5"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

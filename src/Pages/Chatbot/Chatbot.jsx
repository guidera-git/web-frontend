
import { ThemeContext } from "../../ThemeContext";
import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import "./Chatbot.css";

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

    const sendMessage = () => {
        if (input.trim() === "") return;

        setMessages([...messages, { text: input, type: "outgoing" }]);
        setInput("");

        // Simulating bot response after 1 second
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { text: "This is a bot response!", type: "incoming" },
            ]);
        }, 1000);
    };

    return (
        <div className="d-flex custom-container  vh-100">
            {/* Chat Box Container */}
            <div className="flex-grow-1 overflow-auto d-flex flex-column align-items-center p-3"
                style={{ maxHeight: "calc(100vh - 70px)", paddingBottom: "80px" }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`d-flex ${msg.type === "outgoing" ? "justify-content-end" : "justify-content-start"
                            } w-100 mb-2`}
                    >
                        <div
                            className={`p-3 shadow-sm ${msg.type === "outgoing" ? "bg-primary text-white" : "bg-light text-dark"
                                }`}
                            style={{
                                maxWidth: "50%", // Reduce width slightly for more space on both sides
                                borderRadius: "25px", // More rounded look
                                padding: "12px 18px",
                                marginLeft: msg.type === "incoming" ? "20%" : "auto", // Adds space on left for incoming
                                marginRight: msg.type === "outgoing" ? "20%" : "auto", // Adds space on right for outgoing
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>



            {/* Fixed Input Field at Bottom */}
            <div
                className="position-fixed bottom-0 p-3 shadow start-50 translate-middle-x"
                style={{ width: "60%" }} // Adjust this value as needed
            >

                <div className="input-group">
                    <input
                        type="text"
                        className="form-control bg-light rounded-pill px-3"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        style={{ borderRadius: "30px" }} // Extra rounding if needed
                    />
                    <button className="btn btn-light rounded-pill border ms-2" onClick={sendMessage}>
                        <i className="bi bi-send text-primary"></i> {/* Blue icon with white background */}
                    </button>
                </div>
            </div>


        </div>
    );
}

export default Chatbot;

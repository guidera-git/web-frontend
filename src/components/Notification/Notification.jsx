import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Button } from "react-bootstrap";
import axios from "axios";
import { ThemeContext } from "../../ThemeContext";
import "./Notification.css"; // Add this for custom responsive dropdown

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [isHamburger, setIsHamburger] = useState(false);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const handleResize = () => {
            setIsHamburger(window.innerWidth <= 768); // you can adjust this value based on your layout
        };

        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3000/api/reminders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(response.data.reminders || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `http://localhost:3000/api/reminders/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, status: true } : n
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.status).length;

    return (
        <Dropdown className={`dropdown-notifications ${isHamburger ? "dropdown-right" : ""}`} drop="down" align="end">
            <Dropdown.Toggle
                as="div"
                className="position-relative"
                style={{ cursor: "pointer" }}
            >
                <img src="/bell.svg" alt="Notifications" width="25" height="25" />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                    </span>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu
                className={`p-3 shadow ${theme === "dark" ? "bg-dark text-white" : ""}`}
                style={{ minWidth: "400px", maxHeight: "400px", overflowY: "auto" }}
            >
                {notifications.length > 0 ? (
                    [...notifications]
                        .sort((a, b) => a.status - b.status)
                        .map((notification, index) => (
                            <div
                                key={index}
                                className={`mb-2 p-2 border rounded ${theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}
                                style={{ borderLeft: "5px solid #007bff" }}
                            >
                                <strong>{notification.university}</strong>
                                <div>{notification.message}</div>
                                <small className="text-primary">{notification.date}</small>
                                {!notification.status && (
                                    <div className="text-end mt-2">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                            Mark as Read
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))
                ) : (
                    <Dropdown.Item disabled>No new notifications</Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Notification;

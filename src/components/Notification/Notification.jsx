import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Button, Tabs, Tab, Spinner } from "react-bootstrap";
import axios from "axios";
import { ThemeContext } from "../../ThemeContext";
import "./Notification.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [isHamburger, setIsHamburger] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  const token = localStorage.getItem("token");
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const handleResize = () => {
      setIsHamburger(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [notifRes, deadlineRes] = await Promise.all([
        axios.get("http://localhost:3000/api/notifications", authHeader),
        axios.get("http://localhost:3000/api/deadlines", authHeader),
      ]);
      setNotifications(notifRes.data || []);
      setDeadlines(deadlineRes.data || []);
    } catch (err) {
      console.error("Error fetching notifications/deadlines:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/notifications/${id}/read`,
        {},
        authHeader
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(
        "http://localhost:3000/api/notifications/mark-all-read",
        {},
        authHeader
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const hasUrgentDeadline = deadlines.some((d) => d.is_urgent);

  return (
    <Dropdown
      className={`dropdown-notifications ${
        isHamburger ? "dropdown-right" : ""
      }`}
      drop="down"
      align="end"
    >
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

        {hasUrgentDeadline && (
          <span
            className="position-absolute top-0 start-0 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ zIndex: 10 }}
          >
            <span className="visually-hidden">Urgent deadline</span>
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className={`p-3 shadow ${theme === "dark" ? "bg-dark text-white" : ""}`}
        style={{ minWidth: "400px", maxHeight: "500px", overflowY: "auto" }}
      >
        <Tabs
          defaultActiveKey="notifications"
          id="notification-tabs"
          className="mb-3"
        >
          {/* Notifications Tab */}
          <Tab eventKey="notifications" title="Notifications">
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-semibold">
                You have {unreadCount} unread notification(s)
              </span>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={handleMarkAllAsRead}
              >
                Mark All Read
              </Button>
            </div>

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" />
              </div>
            ) : notifications.length > 0 ? (
              notifications
                .sort((a, b) => a.is_read - b.is_read)
                .map((n, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 p-2 border rounded ${
                      theme === "dark"
                        ? "bg-dark text-white"
                        : "bg-light text-dark"
                    }`}
                    style={{
                      borderLeft: n.is_read
                        ? "5px solid gray"
                        : "5px solid #007bff",
                    }}
                  >
                    <strong>{n.title}</strong>
                    <div>{n.message}</div>
                    {n.university_title && (
                      <small className="text-muted d-block">
                        {n.university_title}
                      </small>
                    )}
                    <small className="text-primary">
                      {new Date(n.created_at).toLocaleString()}
                    </small>
                    {!n.is_read && (
                      <div className="text-end mt-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleMarkAsRead(n.id)}
                        >
                          Mark as Read
                        </Button>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p>No notifications available.</p>
            )}
          </Tab>

          {/* Deadlines Tab */}
          <Tab eventKey="deadlines" title="Deadlines">
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" />
              </div>
            ) : deadlines.length > 0 ? (
              deadlines.map((d, idx) => (
                <div
                  key={idx}
                  className={`mb-2 p-2 border rounded ${
                    theme === "dark"
                      ? "bg-dark text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{
                    borderLeft: d.is_urgent
                      ? "5px solid red"
                      : "5px solid green",
                  }}
                >
                  <strong>{d.university}</strong>
                  <div>{d.program}</div>
                  <div>
                    <i className="bi bi-calendar-event me-1"></i>
                    <strong>{d.deadline_type}:</strong>{" "}
                    <span
                      className={d.is_urgent ? "text-danger" : "text-success"}
                    >
                      {new Date(d.deadline).toLocaleDateString()} (
                      {d.days_until} days left)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No deadlines found.</p>
            )}
          </Tab>
        </Tabs>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Notification;

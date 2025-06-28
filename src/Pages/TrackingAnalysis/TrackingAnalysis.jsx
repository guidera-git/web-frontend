import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext"; // Adjust the path as needed

function TrackingAnalysis() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <Section1 />
      <Section2 />
      <Section3 />
      <button
        className="bt_float btn btn-primary position-fixed rounded-pill d-flex align-items-center"
        style={{
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          zIndex: 1000,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
        onClick={() => navigate("/saved")}
      >
        <i className="bi bi-bookmark-fill me-2"></i>
        Saved Programs
      </button>
    </div>
  );
}

function Section1() {
  const { theme } = useContext(ThemeContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const completed = applications.filter(
      (app) => app.status === "completed"
    ).length;
    const inProgress = applications.filter(
      (app) => app.status === "in_progress"
    ).length;
    const avgProgress =
      total > 0
        ? applications.reduce(
            (sum, app) => sum + (app.progress_percentage || 0),
            0
          ) / total
        : 0;

    return {
      total,
      completed,
      inProgress,
      avgProgress: Math.round(avgProgress) || 0,
    };
  }, [applications]);

  if (loading) {
    return (
      <div
        className={`card mb-4 ${theme === "dark" ? "bg-dark text-white" : ""}`}
      >
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading applications...</p>
        </div>
      </div>
    );
  }

  const cardStyle = {
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease-in-out",
  };

  const getColorClass = (type) => {
    const base = theme === "dark" ? "text-white" : "text-dark";
    const bgMap = {
      total: theme === "dark" ? "bg-primary" : "bg-info",
      inProgress: theme === "dark" ? "bg-warning" : "bg-warning",
      completed: theme === "dark" ? "bg-success" : "bg-success",
      avg: theme === "dark" ? "bg-danger" : "bg-danger",
    };
    return `${bgMap[type]} ${base}`;
  };

  return (
    <div
      className={`card mb-4 border-0 shadow-sm ${
        theme === "dark" ? "bg-dark text-white" : "bg-white"
      }`}
    >
      <div className="card-body">
        <h2 className="card-title mb-4"> My Application Analytics</h2>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div
              className={`p-4 text-center rounded ${getColorClass("total")}`}
              style={cardStyle}
            >
              <i className="bi bi-folder2-open display-5 mb-2"></i>
              <h3>{stats.total}</h3>
              <p className="mb-0">Total Applications</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div
              className={`p-4 text-center rounded ${getColorClass(
                "inProgress"
              )}`}
              style={cardStyle}
            >
              <i className="bi bi-hourglass-split display-5 mb-2"></i>
              <h3>{stats.inProgress}</h3>
              <p className="mb-0">In Progress</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div
              className={`p-4 text-center rounded ${getColorClass(
                "completed"
              )}`}
              style={cardStyle}
            >
              <i className="bi bi-check2-circle display-5 mb-2"></i>
              <h3>{stats.completed}</h3>
              <p className="mb-0">Completed</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div
              className={`p-4 text-center rounded ${getColorClass("avg")}`}
              style={cardStyle}
            >
              <i className="bi bi-bar-chart-line-fill display-5 mb-2"></i>
              <h3>{stats.avgProgress}%</h3>
              <p className="mb-0">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section2() {
  const { theme } = useContext(ThemeContext);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      switch (filter) {
        case "recent":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return new Date(app.created_at) >= thirtyDaysAgo;
        case "completed":
          return app.status === "completed";
        case "in-progress":
          return app.status === "in_progress";
        default:
          return true;
      }
    });
  }, [applications, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div
        className={`card mb-4 ${theme === "dark" ? "bg-dark text-white" : ""}`}
      >
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card mb-4 ${theme === "dark" ? "bg-dark text-white" : ""}`}
    >
      <div className="card-body p-0">
        <div
          className={`p-3 border-bottom ${
            theme === "dark" ? "border-secondary" : ""
          }`}
        >
          <h5 className="card-title mb-0">Applications</h5>
        </div>

        <div
          className={`p-3 border-bottom ${
            theme === "dark" ? "border-secondary" : ""
          }`}
        >
          <div className="btn-group btn-group-sm" role="group">
            {["all", "recent", "completed", "in-progress"].map((option) => (
              <button
                key={option}
                type="button"
                className={`btn ${
                  filter === option ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setFilter(option);
                  setCurrentPage(1);
                }}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table
            className={`table mb-0 ${
              theme === "dark" ? "table-dark" : "table-hover"
            }`}
          >
            <thead className={theme === "dark" ? "bg-secondary" : "bg-light"}>
              <tr>
                <th className="ps-3">Application ID</th>
                <th>Status</th>
                <th className="pe-3">Start Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((app) => {
                const appId = app.id ? String(app.id).slice(-6) : "N/A";
                return (
                  <tr key={app.id}>
                    <td className="ps-3">APP{appId}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          app.status === "completed"
                            ? "bg-success"
                            : app.status === "in_progress"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {app.status ? app.status.replace("_", " ") : "Unknown"}
                      </span>
                    </td>
                    <td className="pe-3">
                      {app.created_at
                        ? new Date(app.created_at).toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div
            className={`text-center py-4 ${
              theme === "dark" ? "text-light" : "text-muted"
            }`}
          >
            No applications found
          </div>
        )}

        {filteredApplications.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className={`page-link ${
                      theme === "dark" ? "bg-dark text-white" : ""
                    }`}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <li
                      key={number}
                      className={`page-item ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      <button
                        className={`page-link ${
                          theme === "dark"
                            ? currentPage === number
                              ? ""
                              : "bg-dark text-white"
                            : ""
                        }`}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className={`page-link ${
                      theme === "dark" ? "bg-dark text-white" : ""
                    }`}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

function Section3() {
  const { theme } = useContext(ThemeContext);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [phaseNotes, setPhaseNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(response.data);

        const notes = {};
        response.data.forEach((app) => {
          app.phases?.forEach((phase) => {
            notes[`${app.id}-${phase.phase}`] = phase.note || "";
          });
        });
        setPhaseNotes(notes);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditApplication = (app) => {
    setSelectedApp(app);
    setShowPhaseModal(true);
  };

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/applications/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications((prev) => prev.filter((app) => app.id !== appId));
      toast.success("Application deleted successfully");

      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  const handlePhaseUpdate = async (appId, phase, completed, note) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/api/applications/${appId}/phase`,
        {
          phase: phase.phase,
          completed,
          note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.get(
        "http://localhost:3000/api/applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update all applications
      setApplications(response.data);

      // 🔁 Update selected application with the new one
      const updatedApp = response.data.find((app) => app.id === appId);
      setSelectedApp(updatedApp);

      // Update notes
      setPhaseNotes((prev) => ({
        ...prev,
        [`${appId}-${phase.phase}`]: note,
      }));

      toast.success("Phase updated successfully");
    } catch (error) {
      console.error("Error updating phase:", error);
      toast.error("Failed to update phase");
    }
  };

  if (loading) {
    return (
      <div
        className={`card mb-4 ${theme === "dark" ? "bg-dark text-white" : ""}`}
      >
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card mb-3 shadow-sm ${
        theme === "dark" ? "bg-dark text-white" : ""
      }`}
    >
      <div className="card-body">
        <h2 className="card-title mb-4">My Active Applications</h2>

        <div className="applications-list">
          {currentItems.length === 0 ? (
            <div
              className={`p-3 text-center rounded ${
                theme === "dark"
                  ? "bg-secondary text-white border-dark"
                  : "bg-light text-muted"
              }`}
            >
              No applications found.
            </div>
          ) : (
            currentItems.map((app) => (
              <div
                key={app.id}
                className={`mb-3 p-3 border rounded ${
                  theme === "dark"
                    ? "bg-secondary text-white border-dark"
                    : "bg-light"
                }`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4>{app.university_title}</h4>
                    <h5>{app.program_title}</h5>
                  </div>
                  <div className="text-end">
                    <div className="progress mb-2" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${app.progress_percentage}%` }}
                      ></div>
                    </div>
                    <small>{app.progress_percentage}%</small>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-2">
                  <button
                    className={`btn btn-sm me-2 ${
                      theme === "dark"
                        ? "btn-outline-light"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => handleEditApplication(app)}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button
                    className={`btn btn-sm ${
                      theme === "dark"
                        ? "btn-outline-warning"
                        : "btn-outline-danger"
                    }`}
                    onClick={() => handleDeleteApplication(app.id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {applications.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className={`page-link ${
                      theme === "dark" ? "bg-dark text-white" : ""
                    }`}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <li
                      key={number}
                      className={`page-item ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      <button
                        className={`page-link ${
                          theme === "dark"
                            ? currentPage === number
                              ? ""
                              : "bg-dark text-white"
                            : ""
                        }`}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className={`page-link ${
                      theme === "dark" ? "bg-dark text-white" : ""
                    }`}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {showPhaseModal && selectedApp && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowPhaseModal(false)}
          >
            <div
              className={`modal-dialog modal-dialog-centered ${
                theme === "dark" ? "modal-dark" : ""
              }`}
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`modal-content ${
                  theme === "dark" ? "bg-dark text-white" : ""
                }`}
              >
                <div
                  className={`modal-header ${
                    theme === "dark" ? "border-secondary" : ""
                  }`}
                >
                  <h5 className="modal-title">
                    {selectedApp.university_title} - {selectedApp.program_title}
                  </h5>
                  <button
                    type="button"
                    className={`btn-close ${
                      theme === "dark" ? "btn-close-white" : ""
                    }`}
                    onClick={() => setShowPhaseModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="phases-list">
                    {selectedApp.phases?.map((phase, index) => (
                      <div
                        key={index}
                        className={`mb-3 p-3 border rounded ${
                          phase.completed
                            ? theme === "dark"
                              ? "bg-success bg-opacity-25"
                              : "bg-success bg-opacity-10"
                            : theme === "dark"
                            ? "bg-secondary"
                            : "bg-light"
                        } ${theme === "dark" ? "border-secondary" : ""}`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6>
                            {phase.phase
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </h6>
                          <span
                            className={`badge ${
                              phase.completed
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {phase.completed ? "Completed" : "Pending"}
                          </span>
                        </div>
                        <p
                          className={
                            theme === "dark" ? "text-light" : "text-muted"
                          }
                        >
                          {phase.description}
                        </p>

                        <div className="mb-3">
                          <label className="form-label">Notes</label>
                          <textarea
                            className={`form-control ${
                              theme === "dark" ? "bg-dark text-white" : ""
                            }`}
                            value={
                              phaseNotes[`${selectedApp.id}-${phase.phase}`] ||
                              ""
                            }
                            onChange={(e) => {
                              const newNotes = { ...phaseNotes };
                              newNotes[`${selectedApp.id}-${phase.phase}`] =
                                e.target.value;
                              setPhaseNotes(newNotes);
                            }}
                            placeholder="Add your notes here..."
                          />
                        </div>

                        <div className="d-flex justify-content-end">
                          <button
                            className={`btn btn-sm ${
                              phase.completed
                                ? "btn-success"
                                : "btn-outline-success"
                            }`}
                            onClick={() =>
                              handlePhaseUpdate(
                                selectedApp.id,
                                phase,
                                !phase.completed,
                                phaseNotes[
                                  `${selectedApp.id}-${phase.phase}`
                                ] || ""
                              )
                            }
                          >
                            {phase.completed
                              ? "Mark Incomplete"
                              : "Mark Complete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className={`btn ${
                        theme === "dark" ? "btn-secondary" : "btn-primary"
                      }`}
                      onClick={() => setShowPhaseModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackingAnalysis;

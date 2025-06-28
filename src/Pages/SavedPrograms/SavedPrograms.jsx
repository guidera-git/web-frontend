import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../ThemeContext";

function SavedPrograms() {
  const { theme } = useContext(ThemeContext);
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [application, setApplication] = useState(null);
  const [notes, setNotes] = useState({});
  const [applicationStatus, setApplicationStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 8;

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchSavedPrograms();
  }, []);

  const fetchSavedPrograms = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/saved-programs",
        authHeader
      );
      const mapped = data.map((p) => ({
        id: p.saved_id,
        university: p.university_title,
        university_id: p.university_id,
        program_id: p.program_id,
        degree: p.program_title,
        fee: p.calculated_total_fee,
        duration: p.program_duration,
        location: p.location,
        qsRanking: p.qs_ranking,
        deadline:
          p.important_dates?.[0]?.deadline_application_submission ?? null,
      }));

      const statusObj = {};
      for (const prog of mapped) {
        const res = await axios.get(
          `http://localhost:3000/api/applications/check/${prog.program_id}/${prog.university_id}`,
          authHeader
        );
        statusObj[prog.id] = res.data.exists;
      }
      setApplicationStatus(statusObj);
      setSavedPrograms(mapped);
    } catch (err) {
      console.error("Error fetching saved programs:", err);
    }
  };

  const handleUnsave = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/saved-programs/${id}`,
        authHeader
      );
      setSavedPrograms((prev) => prev.filter((prog) => prog.id !== id));
      setSelectedApp(null);
      toast.success("Program removed from saved list");
    } catch (err) {
      console.error("Error unsaving program:", err);
      toast.error("Failed to remove program");
    }
  };

  const handleNoteChange = (phaseId, note) => {
    setNotes((prev) => ({ ...prev, [phaseId]: note }));
  };

  const handleStartOrContinue = async (prog) => {
    if (applicationStatus[prog.id]) {
      return loadApplication(prog);
    }

    if (prog.deadline) {
      const dl = new Date(prog.deadline);
      if (new Date() > dl) {
        toast.warning(
          `🚫 Deadline has passed. Last date was: ${prog.deadline}`,
          { position: "top-center", autoClose: 5000 }
        );
        return;
      }
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/applications",
        { program_id: prog.program_id, university_id: prog.university_id },
        authHeader
      );
      toast.success("✅ Application started!", {
        position: "top-center",
        autoClose: 4000,
      });
      setApplicationStatus((prev) => ({ ...prev, [prog.id]: true }));
      setApplication(data.application);
      setSelectedApp(prog);
      setNotes(
        (data.application.phases || []).reduce((acc, ph) => {
          if (ph.note) acc[ph.phase] = ph.note;
          return acc;
        }, {})
      );
    } catch (err) {
      const msg = err.response?.data?.error || "⚠️ Starting failed.";
      toast.error(msg, { position: "top-center", autoClose: 5000 });
      console.error(err);
    }
  };

  const loadApplication = async (prog) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/applications/check/${prog.program_id}/${prog.university_id}`,
        authHeader
      );
      if (!res.data.exists) return;

      const appId = res.data.application.id;
      const appRes = await axios.get(
        `http://localhost:3000/api/applications/${appId}`,
        authHeader
      );
      const app = appRes.data;
      setApplication(app);
      setSelectedApp(prog);
      setNotes(
        (app.phases || []).reduce((acc, ph) => {
          if (ph.note) acc[ph.phase] = ph.note;
          return acc;
        }, {})
      );
    } catch (err) {
      console.error("Error loading application:", err);
    }
  };

  const updatePhase = async (phaseKey, completed) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/applications/${application.id}/phase`,
        { phase: phaseKey, completed, note: notes[phaseKey] || "" },
        authHeader
      );
      setApplication(res.data);
    } catch (err) {
      console.error("Error updating phase:", err);
      toast.error("⚠️ Failed to update phase", { position: "top-center" });
    }
  };

  const calculateProgress = () => application.progress_percentage || 0;

  // Pagination logic
  const totalPages = Math.ceil(savedPrograms.length / programsPerPage);
  const paginatedPrograms = savedPrograms.slice(
    (currentPage - 1) * programsPerPage,
    currentPage * programsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div
      className={`container mt-5 ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <h4 className="text-center">Saved Programs</h4>
      <p className="text-center">
        See all your saved programs and stay updated
      </p>
      <div className="row">
        {paginatedPrograms.map((app) => (
          <div key={app.id} className="col-md-6 mb-3">
            <div
              className={`card h-100 ${
                theme === "dark"
                  ? "bg-dark text-white border-secondary"
                  : "bg-white text-dark border"
              } shadow-sm`}
            >
              <div className="card-body">
                <div className="position-absolute top-0 end-0 p-2 me-2">
                  <i
                    className={`bi bi-bookmark-fill fs-4 ${
                      theme === "dark" ? "text-warning" : "text-primary"
                    }`}
                    style={{ cursor: "pointer" }}
                    title="Click to remove"
                    onClick={() => handleUnsave(app.id)}
                  ></i>
                </div>
                <div className="pe-4">
                  <h4 style={{ wordBreak: "break-word" }}>{app.university}</h4>
                </div>

                <p>{app.degree}</p>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {app.location || "Not Available"}
                  </div>
                  <div>
                    <span
                      className={`badge ${
                        theme === "dark"
                          ? "bg-dark text-warning border border-warning"
                          : "bg-light text-primary border border-primary"
                      }`}
                    >
                      QS #{app.qsRanking || "Not Available"}
                    </span>
                  </div>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <small>Total Fee</small>
                    <div className="fw-semibold">
                      {app.fee || "Not Available"}
                    </div>
                  </div>
                  <div>
                    <small>Duration</small>
                    <div className="fw-semibold">
                      {app.duration || "Not Available"}
                    </div>
                  </div>
                </div>
                {(() => {
                  const deadlineDate = new Date(app.deadline);
                  const today = new Date();
                  const isPassed =
                    app.deadline !== "Check university website" &&
                    today > deadlineDate;

                  return (
                    <p
                      className={`mb-2 ${
                        isPassed ? "text-danger" : "text-success"
                      }`}
                    >
                      <i className="bi bi-clock me-1"></i>
                      Deadline: {app.deadline}
                    </p>
                  );
                })()}

                <div className="d-flex gap-2">
                  <button
                    className={`btn ${
                      applicationStatus[app.id] ? "btn-primary" : "btn-success"
                    }`}
                    onClick={() => handleStartOrContinue(app)}
                  >
                    <i className="bi bi-pencil-square"></i>{" "}
                    {applicationStatus[app.id]
                      ? "Continue Application"
                      : "Start Application"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <li
                    key={pageNum}
                    className={`page-item ${
                      pageNum === currentPage ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
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
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      {selectedApp && application && (
        <div
          className="modal-overlay d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1050,
            backdropFilter: "blur(3px)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            padding: "20px",
          }}
          onClick={() => {
            setSelectedApp(null);
            setApplication(null);
          }}
        >
          <div
            className={`card shadow-lg p-4 rounded-4 w-100 ${
              theme === "dark"
                ? "bg-dark text-white border-secondary"
                : "bg-white text-dark border"
            }`}
            style={{
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "hidden",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fw-bold mb-0">{selectedApp.university}</h4>
                <p className="text-muted mb-1">{selectedApp.degree}</p>
              </div>
              <div className="text-end">
                <p className="mb-1 small">
                  {application.phases.filter((ph) => ph.completed).length} of{" "}
                  {application.phases.length} stages completed
                </p>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Phases List */}
            <div
              className="overflow-auto pe-2"
              style={{ maxHeight: "60vh", paddingRight: "6px" }}
            >
              {application.phases.map((ph, idx) => (
                <div
                  key={ph.phase}
                  className={`mb-4 p-3 border rounded-3 shadow-sm ${
                    theme === "dark" ? "bg-dark" : "bg-light"
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">
                      {idx + 1}. {ph.title || ph.description}
                      {ph.completed && (
                        <span className="badge bg-success ms-2">Completed</span>
                      )}
                    </h5>
                  </div>
                  <p className={`text-${theme === "dark" ? "light" : "muted"}`}>
                    {ph.description}
                  </p>
                  {ph.note && (
                    <div className="bg-secondary text-white rounded p-2 mb-2">
                      <strong>Your Note:</strong> {ph.note}
                    </div>
                  )}
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm btn-outline-${
                        theme === "dark" ? "light" : "primary"
                      }`}
                      onClick={() => {
                        const n = prompt(
                          "Add your note:",
                          notes[ph.phase] || ph.note || ""
                        );
                        if (n !== null) {
                          const updatedNotes = { ...notes, [ph.phase]: n };
                          setNotes(updatedNotes);
                          updatePhase(ph.phase, ph.completed, updatedNotes);
                        }
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i> Add Note
                    </button>
                    <button
                      className={`btn btn-sm ${
                        ph.completed ? "btn-success" : "btn-outline-success"
                      }`}
                      onClick={() => updatePhase(ph.phase, !ph.completed)}
                    >
                      <i
                        className={`bi ${
                          ph.completed ? "bi-check-circle-fill" : "bi-circle"
                        }`}
                      ></i>{" "}
                      {ph.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-end mt-4">
              <button
                className={`btn btn-${
                  theme === "dark" ? "secondary" : "outline-secondary"
                }`}
                onClick={() => {
                  setSelectedApp(null);
                  setApplication(null);
                }}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer theme={theme} />
    </div>
  );
}

export default SavedPrograms;

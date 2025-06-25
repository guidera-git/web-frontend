import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../ThemeContext";

function SavedPrograms() {
  const { theme } = useContext(ThemeContext);
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({});
  const [notes, setNotes] = useState({});
  const [applicationStatus, setApplicationStatus] = useState({});

  const steps = [
    {
      id: 1,
      title: "Document Gathering",
      description:
        "Start gathering all required documents for your application. Get your transcripts, certificates, and other necessary paperwork ready.",
    },
    {
      id: 2,
      title: "Application Submission",
      description:
        "Submit your completed application form with all required documents to the university.",
    },
    {
      id: 3,
      title: "Test Preparation",
      description: "Prepare for and take any required admission tests.",
    },
    {
      id: 4,
      title: "Admission Decision",
      description: "Wait for and review the university's admission decision.",
    },
  ];

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
      const mapped = data.map((program) => ({
        id: program.saved_id,
        university: program.university_title,
        university_id: program.university_id,
        program_id: program.program_id,
        degree: program.program_title,
        fee: program.calculated_total_fee,
        duration: program.program_duration,
        location: program.location,
        qsRanking: program.qs_ranking,
        deadline:
          program.important_dates?.[0]?.deadline_application_submission ??
          "Check university website",
      }));

      for (const prog of mapped) {
        const res = await axios.get(
          `http://localhost:3000/api/applications/check/${prog.program_id}/${prog.university_id}`,
          authHeader
        );
        setApplicationStatus((prev) => ({
          ...prev,
          [prog.id]: res.data.exists,
        }));
      }

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

  const handleNoteChange = (stepId, note) => {
    setNotes((prev) => ({ ...prev, [stepId]: note }));
  };

  const toggleStepCompletion = (stepId) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleModalClose = () => {
    setSelectedApp(null);
    setCurrentStep(1);
    setCompletedSteps({});
    setNotes({});
  };

  const calculateProgress = () => {
    const total = steps.length;
    const completed = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const handleStartOrContinue = async (app) => {
    const exists = applicationStatus[app.id];

    if (exists) {
      setSelectedApp(app);
      return;
    }

    const deadline = app.important_dates?.[0]?.deadline_application_submission;

    if (deadline) {
      const deadlineDate = new Date(deadline);
      const today = new Date();

      if (today > deadlineDate) {
        toast.warning(`🚫 Deadline has passed. Last date was: ${deadline}`, {
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }
    }

    try {
      await axios.post(
        "http://localhost:3000/api/applications",
        {
          program_id: app.program_id,
          university_id: app.university_id,
        },
        authHeader
      );

      setApplicationStatus((prev) => ({ ...prev, [app.id]: true }));
      setSelectedApp(app);
      toast.success("✅ Application started successfully!", {
        position: "top-center",
        autoClose: 4000,
      });
    } catch (err) {
      const message =
        err.response?.data?.error || "⚠️ Application creation failed.";
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
      });
      console.error("Error starting application:", err);
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
        {savedPrograms.map((app) => (
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
      {/* Application Steps Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div
            className={`p-4 rounded-3 shadow-lg ${
              theme === "dark"
                ? "bg-dark text-white border border-secondary"
                : "bg-white text-dark border border-light"
            }`}
            style={{ maxWidth: "800px", maxHeight: "90vh", overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4
                  className={`mb-0 text-truncate me-2 text-${
                    theme === "dark" ? "light" : "dark"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  {selectedApp.university}
                </h4>
                <p
                  className={`mb-0 text-${theme === "dark" ? "light" : "dark"}`}
                >
                  {selectedApp.degree}
                </p>
              </div>
              <div className="text-end">
                <p
                  className={`mb-0 text-${theme === "dark" ? "light" : "dark"}`}
                >
                  {Object.values(completedSteps).filter(Boolean).length} of{" "}
                  {steps.length} stages completed
                </p>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div
              className="steps-container"
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`mb-4 p-3 border rounded ${
                    currentStep === step.id
                      ? `border-${theme === "dark" ? "warning" : "primary"}`
                      : ""
                  } ${theme === "dark" ? "bg-dark" : "bg-light"}`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5
                      className={`mb-0 text-${
                        theme === "dark" ? "light" : "dark"
                      }`}
                    >
                      {step.id}. {step.title}
                      {completedSteps[step.id] && (
                        <span className="badge bg-success ms-2">Completed</span>
                      )}
                    </h5>
                    <div>
                      <button
                        className={`btn btn-sm btn-outline-${
                          theme === "dark" ? "light" : "secondary"
                        } me-2`}
                        onClick={() => {
                          const note = prompt(
                            "Add your note:",
                            notes[step.id] || ""
                          );
                          if (note !== null) handleNoteChange(step.id, note);
                        }}
                      >
                        <i className="bi bi-pencil"></i> Add Note
                      </button>
                      <button
                        className={`btn btn-sm ${
                          completedSteps[step.id]
                            ? "btn-success"
                            : `btn-outline-success`
                        }`}
                        onClick={() => toggleStepCompletion(step.id)}
                      >
                        {completedSteps[step.id] ? (
                          <i className="bi bi-check-circle"></i>
                        ) : (
                          <i className="bi bi-circle"></i>
                        )}{" "}
                        Mark{" "}
                        {completedSteps[step.id] ? "Incomplete" : "Complete"}
                      </button>
                    </div>
                  </div>
                  <p className={`text-${theme === "dark" ? "light" : "muted"}`}>
                    {step.description}
                  </p>
                  {notes[step.id] && (
                    <div
                      className={`p-2 rounded mt-2 ${
                        theme === "dark" ? "bg-secondary" : "bg-light"
                      }`}
                    >
                      <p className="mb-0">
                        <strong>Your Note:</strong> {notes[step.id]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                className={`btn btn-${
                  theme === "dark" ? "secondary" : "outline-secondary"
                }`}
                onClick={handleModalClose}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <div className="step-navigation">
                {currentStep > 1 && (
                  <button
                    className={`btn btn-outline-${
                      theme === "dark" ? "light" : "primary"
                    } me-2`}
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length && (
                  <button
                    className={`btn btn-${
                      theme === "dark" ? "warning" : "primary"
                    }`}
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </button>
                )}
                {currentStep === steps.length && (
                  <button className="btn btn-success">
                    <i className="bi bi-check-circle"></i> Complete Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer theme={theme} />
    </div>
  );
}

export default SavedPrograms;

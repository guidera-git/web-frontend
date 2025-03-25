import "bootstrap/dist/css/bootstrap.min.css";
import "./TrackingAnalysis.css";
import React, { useState, useMemo, useEffect } from "react";

const applications = [
  {
    id: "APP202401",
    percentage: 25,
    status: "In Progress",
    startDate: "2025-08-10",
    university: "UCP",
    degree: "BSSE",
    fee: "180,000 PKR",
    admissionOpen: true,
    checklist: {
      applicationSubmitted: true,
      testScheduled: false,
      testTaken: false,
      admissionDecision: false,
    },
  },
  {
    id: "APP202402",
    percentage: 100,
    status: "Completed",
    startDate: "2025-09-15",
    university: "LUMS",
    degree: "BBA",
    fee: "300,000 PKR",
    admissionOpen: false,
    checklist: {
      applicationSubmitted: true,
      testScheduled: true,
      testTaken: true,
      admissionDecision: true,
    },
  },
  {
    id: "APP202403",
    percentage: 50,
    status: "In Progress",
    startDate: "2025-10-01",
    university: "FAST",
    degree: "CS",
    fee: "250,000 PKR",
    admissionOpen: true,
    checklist: {
      applicationSubmitted: true,
      testScheduled: true,
      testTaken: false,
      admissionDecision: false,
    },
  },
  {
    id: "APP202405",
    percentage: 100,
    status: "Completed",
    startDate: "2025-09-15",
    university: "FAST",
    degree: "BBA",
    fee: "300,000 PKR",
    admissionOpen: false,
    checklist: {
      applicationSubmitted: true,
      testScheduled: true,
      testTaken: true,
      admissionDecision: true,
    },
  },
];

function TrackingAnalysis() {
  return (
    <>
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
        onClick={() => {
          document.getElementById("saved-programs-section")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        <i className="bi bi-bookmark-fill me-2"></i>
        Saved Programs
      </button>
    </>
  );
}
const ProgressModal = ({ app, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="tracking-modal bg-white p-4 rounded-3 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-dark">Application Progress - {app.university}</h4>
        <p className="text-dark">Degree: {app.degree}</p>
        <p className="text-dark">Completion: {Math.round(app.percentage)}%</p>

        <div className="progress mb-3">
          <div
            className="progress-bar bg-success"
            style={{ width: `${app.percentage}%` }}
          >
            {Math.round(app.percentage)}%
          </div>
        </div>

        <h5 className="mt-4 text-dark">Application Checklist</h5>
        <ul className="list-group">
          {Object.entries(app.checklist).map(([field, isChecked]) => (
            <li
              key={field}
              className="list-group-item d-flex align-items-center"
            >
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="form-check-input me-2"
              />
              <span>{field.replace(/([A-Z])/g, " $1").trim()}</span>
            </li>
          ))}
        </ul>

        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-secondary" onClick={onClose}>
            <i className="bi bi-arrow-left"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
};
function Section1() {
  const [apps] = useState(applications);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewingApp, setViewingApp] = useState(null);
  const handleNext = () => {
    if (isAnimating || currentCardIndex >= apps.length - 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating || currentCardIndex <= 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentCardIndex((prev) => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleCardClick = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const cardWidth = rect.width;

    if (clickPosition > cardWidth * 0.8) handleNext();
    else if (clickPosition < cardWidth * 0.2) handlePrev();
  };

  return (
    <div className="container mt-4 border-bottom border-2 border-primary">
      <h2 className="text-center">
        Tracking <span className="text-primary">&</span> Analytics
      </h2>
      <p className="text-center">Track and keep in check of your progress</p>

      {/* Card Stack - Centered with Bootstrap */}
      <div className="d-flex justify-content-center">
        <div className="card-stack-container" style={{ maxWidth: "900px" }}>
          <div className="card-stack-wrapper">
            {apps.map((app, index) => (
              <div
                key={app.id}
                className={`progress-card ${
                  index === currentCardIndex ? "active" : "inactive"
                } ${
                  isAnimating && index === currentCardIndex
                    ? "animating-out"
                    : ""
                } ${
                  isAnimating && index === currentCardIndex + 1
                    ? "animating-in"
                    : ""
                }`}
                onClick={handleCardClick}
              >
                <div className="text-center">
                  <h4>Application ID: {app.id}</h4>
                  <p>Status: {app.status}</p>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${app.percentage}%` }}
                    >
                      {Math.round(app.percentage)}%
                    </div>
                  </div>
                  <button
                    className="btn btn-primary my-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingApp(app);
                    }}
                  >
                    <i className="bi bi-eye"></i> View Progress
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="d-flex justify-content-center align-items-center gap-3 mb-1">
            <button
              className="btn btn-outline-primary rounded-circle p-0"
              style={{ width: "44px", height: "44px" }}
              onClick={handlePrev}
              disabled={currentCardIndex === 0}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <span
              className="fw-bold font-monospace text-center"
              style={{ minWidth: "60px" }}
            >
              {currentCardIndex + 1} / {apps.length}
            </span>
            <button
              className="btn btn-outline-primary rounded-circle p-0"
              style={{ width: "44px", height: "44px" }}
              onClick={handleNext}
              disabled={currentCardIndex === apps.length - 1}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      {/* Read-only Progress Modal */}
      {viewingApp && (
        <ProgressModal app={viewingApp} onClose={() => setViewingApp(null)} />
      )}
    </div>
  );
}
function Section2() {
  const [apps] = useState(applications);
  const [filter, setFilter] = useState("all");

  // Fixed filter logic using useMemo
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      switch (filter) {
        case "recent":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return new Date(app.startDate) >= thirtyDaysAgo;
        case "completed":
          return app.status.toLowerCase() === "completed";
        case "in-progress":
          return app.status.toLowerCase() === "in progress";
        default:
          return true; // Show all
      }
    });
  }, [apps, filter]);
  return (
    <div className="container border-bottom border-2 border-primary">
      {/* Applications Table with Filters */}
      <h4 className="mt-4">Applications</h4>
      <div className="btn-group">
        {["all", "recent", "completed", "in-progress"].map((option) => (
          <button
            key={option}
            className={`btn ${
              filter === option ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <table className="table table-striped mt-3 text-center">
        <thead>
          <tr>
            <th className="bg-primary border-end text-white">Application ID</th>
            <th className="bg-primary border-end text-white">Status</th>
            <th className="bg-primary text-white">Start Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredApps.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>
                <span
                  className={`badge bg-${
                    app.status === "Completed" ? "success" : "warning"
                  }`}
                >
                  {app.status}
                </span>
              </td>
              <td>{app.startDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Section3() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [apps, setApps] = useState(applications);
  const [tempChecklist, setTempChecklist] = useState({});

  // Initialize temp checklist when app is selected
  useEffect(() => {
    if (selectedApp) {
      setTempChecklist({ ...selectedApp.checklist });
    }
  }, [selectedApp]);

  const handleChecklistToggle = (field) => {
    setTempChecklist((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = () => {
    if (!selectedApp) return;

    const appIndex = apps.findIndex((app) => app.id === selectedApp.id);
    const updatedApps = [...apps];

    // Update the actual checklist
    updatedApps[appIndex].checklist = { ...tempChecklist };

    // Recalculate percentage and status
    const completedTasks = Object.values(tempChecklist).filter(Boolean).length;
    const totalTasks = Object.keys(tempChecklist).length;

    updatedApps[appIndex].percentage = (completedTasks / totalTasks) * 100;
    updatedApps[appIndex].status =
      completedTasks === totalTasks ? "Completed" : "In Progress";

    setApps(updatedApps);
    setSelectedApp(null);
  };

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedApp(null);
    }
  };
  return (
    <div
      className="container border-bottom border-2 border-primary"
      id="saved-programs-section"
    >
      {/* Saved Programs */}
      <h4 className="mt-4 text-center">Saved Programs</h4>
      <p className="mt-2 text-center">
        See All Your saved programs and keep Yourelf update
      </p>
      <div className="row">
        {apps.map((app) => (
          <div key={app.id} className="col-md-6 mb-3">
            <div className="card uni-card h-100 position-relative">
              {/* Bookmark/Save Icon*/}
              <div className="position-absolute top-0 end-0 p-2 me-2">
                <i className="bi bi-bookmark-fill fs-4 text-primary"></i>
              </div>

              <div className="card-body">
                <h4>{app.university}</h4>
                <p>{app.degree}</p>
                <p>Start Date: {app.startDate}</p>
                <p>Fee: {app.fee}</p>
                <p>
                  Admission:{" "}
                  {app.admissionOpen ? (
                    <span className="text-success">
                      <i className="bi bi-check-circle"></i> Open
                    </span>
                  ) : (
                    <span className="text-danger">
                      <i className="bi bi-x-circle"></i> Closed
                    </span>
                  )}
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => setSelectedApp(app)}
                >
                  <i className="bi bi-pencil-square"></i> Start Application
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Tracking Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div
            className="tracking-modal bg-white p-4 rounded-3 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-dark">
              Application Progress - {selectedApp.university}
            </h4>
            <p className="text-dark">Degree: {selectedApp.degree}</p>
            <p className="text-dark">
              Completion: {Math.round(selectedApp.percentage)}%
            </p>

            <div className="progress mb-3">
              <div
                className="progress-bar bg-success"
                style={{ width: `${selectedApp.percentage}%` }}
              >
                {Math.round(selectedApp.percentage)}%
              </div>
            </div>

            <h5 className="mt-4 text-dark">Application Checklist</h5>
            <ul className="list-group">
              {Object.entries(tempChecklist).map(([field, isChecked]) => (
                <li
                  key={field}
                  className="list-group-item d-flex align-items-center"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleChecklistToggle(field)}
                    className="form-check-input me-2"
                  />
                  <span>{field.replace(/([A-Z])/g, " $1").trim()}</span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedApp(null)}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={
                  Object.values(tempChecklist).filter(Boolean).length === 0
                }
              >
                <i className="bi bi-check-circle"></i> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TrackingAnalysis;
